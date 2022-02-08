# -*- coding: utf-8 -*
import logging
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import Comparator, hybrid_property
from sqlalchemy import (exc, event, Column, BigInteger, create_engine,
                        String, Index, Integer, func)
from sqlalchemy.types import TIMESTAMP, ARRAY
from sqlalchemy.pool import Pool, NullPool
from sqlalchemy.sql.expression import text
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.dialects.postgresql import UUID
from collections import defaultdict


logger = logging.getLogger()


class CaseAndSpaceInsensitiveComparator(Comparator):
    def __eq__(self, other):
        lhs = func.lower(func.replace(self.__clause_element__(), ' ', ''))
        rhs = func.lower(func.replace(other, ' ', ''))
        return lhs == rhs


def check_connection(dbapi_conn, conn_record, conn_proxy):
    """
    Check if a connection is active before using it from pool.
    """
    cursor = dbapi_conn.cursor()
    try:
        cursor.execute('SELECT 1')
    except Exception:
        raise exc.DisconnectionError()
    cursor.close()


event.listen(Pool, 'checkout', check_connection)

Base = declarative_base()

CREATED_DEFAULT = 'now()'
PG_UUID = 'gen_random_uuid()'


class Metrics(Base):
    """
    Table to store metrics from monitored services.
    """
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    timestamp = Column(TIMESTAMP(timezone=True),
                       server_default=text(CREATED_DEFAULT),
                       onupdate=datetime.utcnow,
                       nullable=False)
    dimension = Column(String, nullable=False)
    region = Column(String)
    value = Column(Integer, nullable=False)
    response_time = Column(Integer)  # milliseconds
    __tablename__ = 'metrics'
    __table_args__ = (
        Index('idx_metrics_created', timestamp.desc()),
        {'schema': 'cloud_monitor'},
    )


class Users(Base):
    """
    User table
    """
    __tablename__ = 'users'
    __table_args__ = (
        Index('unq_email_users', 'email', unique=True),
        {'schema': 'cloud_monitor'},
    )

    id = Column(UUID(as_uuid=True), primary_key=True,
                server_default=text(PG_UUID))
    created = Column(TIMESTAMP(timezone=True),
                     server_default=text(CREATED_DEFAULT),
                     nullable=False)
    last_upd = Column(TIMESTAMP(timezone=True),
                      server_default=text(CREATED_DEFAULT),
                      onupdate=datetime.utcnow,
                      nullable=False)
    signup_for = Column(ARRAY(String))
    service_alerts = Column(ARRAY(String))
    alert_cadence = Column(String)
    _email = Column('email', String, nullable=False)

    @hybrid_property
    def email(self):
        return self._email

    @email.setter
    def email(self, email):
        try:
            self._email = email.replace(' ', '').lower()
        except AttributeError:
            self._email = email

    @email.expression
    def email(cls):
        return cls._email

    @email.comparator
    def email(cls):
        return CaseAndSpaceInsensitiveComparator(cls._email)


class Model(object):
    def __init__(self, db_uri):
        self.db_uri = db_uri
        self.engine = create_engine(self.db_uri, poolclass=NullPool)
        session_factory = sessionmaker(bind=self.engine, autocommit=False)
        self.Session = scoped_session(session_factory)

    def _insert_record(self, alchemy_class, commit=True, **kwargs):
        """
        Inserts a record into table and returns the record.

        Parameters
        ----------
        alchemy_class: SQLA class name
        commit: autocommit flag, default false
        kargs: dict with field mapping for SQLA class

        Returns
        -------
        Inserted record id or seriali
        """
        session = self.Session()
        obj = alchemy_class(**kwargs)

        try:
            session.add(obj)
            session.flush()
            if commit:
                session.commit()
        except Exception:
            session.rollback()
            raise

        return obj

    def _select_columns(self, alchemy_class, columns, q):
        """
        Filter output columns in query object.

        Parameters
        ----------
        alchemy_class: SQLA class name
        columns: column names as string
        q: query object.

        Returns
        -------
        Query object with required output columns.
        """
        if not columns:
            return q

        attribs = []
        for column in columns:
            try:
                attribs.append(getattr(alchemy_class, column))
            except Exception:
                logger.exception('Error in _select_columns {f}'.
                                 format(f=column))
        if attribs:
            return q.with_entities(*attribs)
        return q

    def _apply_filters(self, alchemy_class, q, filters):
        """
        Apply filter conditions to given query object.

        Parameters
        ----------
        alchemy_class: SQLA class name
        q: SQLA query object
        filters: a list of tuples of the form (field, operator, value)

        Returns
        -------
        SQLA query object with filters applied.
        """
        if not filters:
            return q

        for _filter in filters:
            field, op, value = _filter
            q = q.filter(op(getattr(alchemy_class, field), value))

        return q

    def _apply_sort(self, alchemy_class, q, sort_options):
        """
        Apply sort conditions to given query object

        Parameters
        ----------
        alchemy_class: SQLA class
        q: SQLA query object
        sort_options: A list of tuples of the form (field, sort_function)

        Returns
        -------
        SQLA query object with sort conditions applied.
        """
        if not sort_options:
            return q

        for option in sort_options:
            field, sort_func = option
            q = q.order_by(sort_func(getattr(alchemy_class, field)))

        return q

    def _query_record(self, alchemy_class,
                      fields=None, limit=None, **kwargs):
        """
        Query DB.

        Parameters
        ----------
        alchemy_class: SQLA class name
        fields: columns to include in the query result e.g ['id', 'created']
        limit: Apply LIMIT to query results. None means LIMIT ALL.
        kwargs: dict with mapping for SQLA class fields

        Returns
        -------
        List of SQLA objects or dicts
        """
        session = self.Session()
        objs = None
        q = session.query(alchemy_class).filter_by(**kwargs)
        q = self._select_columns(alchemy_class, fields, q)
        q = q.limit(limit)
        objs = q.all()
        return objs

    def _query_record_enhanced(self, alchemy_class,
                               filters=None, sort_options=None, fields=None,
                               limit=None, q=None):
        """
        Query DB with enhanced options for filtering and sorting.

        Parameters
        ----------
        alchemy_class: SQLA class name
        filters: A list of tuples in the form
                       (field, operator, value)
                 e.g., ('created', op.ge, datetime(2018, 1, 1))
        sort_options: A list of tuples in the form
                            (field, sort_function)
                      e.g., [('created', desc), ('last_upd', asc)]
                            where asc, desc SQLA functions.
        fields: columns to include in the query result e.g ['id', 'created']
        limit: Apply LIMIT to query results. None means LIMIT ALL.
        q: An SQLAlchemy query object to be filtered further

        Returns
        -------
        A list of SQLA objects or dicts.
        """
        session = self.Session()
        objs = None

        if not q:
            q = session.query(alchemy_class)

        q = self._apply_filters(alchemy_class, q, filters)
        q = self._apply_sort(alchemy_class, q, sort_options)
        q = self._select_columns(alchemy_class, fields, q)
        q = q.limit(limit)
        objs = q.all()
        return objs

    def _update_record(self, alchemy_class, id=None, commit=True,
                       **kwargs):
        """
        Update a record in table.

        Parameters
        ----------
        alchemy_class: SQLA class
        id: record id
        commit: toggle session commits
        kwargs: dict with mapping for SQLA class fields

        Returns
        -------
        Updated object
        """
        session = self.Session()
        obj = session.query(alchemy_class).filter_by(id=id).first()

        for key, val in kwargs.items():
            setattr(obj, key, val)

        try:
            session.merge(obj)
            session.flush()
            if commit:
                session.commit()
        except Exception:
            session.rollback()
            raise

        return obj

    def insert_users(self, **kwargs):
        return self._insert_record(Users, **kwargs)

    def query_users(self, **kwargs):
        return self._query_record(Users, **kwargs)

    def update_users(self, id=None, **kwargs):
        return self._update_record(Users, id=id, **kwargs)

    def insert_metrics(self, **kwargs):
        return self._insert_record(Metrics, **kwargs)

    def query_metrics(self, **kwargs):
        return self._query_record(Metrics, **kwargs)

    def query_metrics_chartjs(self, exclude_apps=True, serialize=True,
                              groupby='hour', region='us-east-1', **kwargs):
        """
        Query metrics for last 24 hours. The output needs to be
        re ordered to meet chartjs line bar spec.

        Commented out 'h' below as it seems to be interfering with results.
        Need to investigate why.

        Parameters
        ----------
        exclude: A list of dimensions to be excluded from the result.
        serialize: if set, convert SQLA objects to dicts in a format suitable
        for chartjs.
        region: region name. Default us-east-1. Pass None for all regions.
        """
        if exclude_apps:
            exclude_clause = "AND dimension not in ('Lambda Random Shade Generator', 'EC2 Bezos Quote Generator', 'S3 File Serving', 'SQS + EC2 Voting Game') AND dimension not like 'Monitor %'" # noqa
        else:
            exclude_clause = ""

        if region:
            region_clause = f"AND region = '{region}'"
        else:
            region_clause = ""

        session = self.Session()
        stmt = f"""select
                  date_trunc('{groupby}', timestamp) as timestamp,
                  -- extract(epoch from(current_timestamp - timestamp))/3600||'h' as h,
                  dimension,
                  region,
                  CASE
                    WHEN value = 0 THEN 'down'
                    ELSE 'up'
                  END status,
                  count(value) as "count"
                  from
                  cloud_monitor.metrics m
                  where
                  m.timestamp between now() - interval '24 hours' and now()
                  {exclude_clause}
                  {region_clause}
                  GROUP BY
                  date_trunc('{groupby}', timestamp),
                  -- extract(epoch from(current_timestamp - timestamp))/3600||'h',
                  dimension,
                  region,
                  CASE
                    WHEN value = 0 THEN 'down'
                    ELSE 'up'
                  END
                  order by timestamp asc;"""
        rows = session.execute(stmt).fetchall()

        if not serialize:
            return rows

        d = defaultdict(lambda: defaultdict(dict))

        for row in rows:
            d[row.dimension][row.timestamp][row.status] = row.count
            d[row.dimension][row.timestamp]['region'] = row.region

        out = defaultdict(list)
        summary = defaultdict(lambda: defaultdict(dict))
        summary['all']['up'] = 0
        summary['all']['down'] = 0

        for service, ts_group in d.items():
            summary[service]['up'] = 0
            summary[service]['down'] = 0

            for ts, v in ts_group.items():
                up = v.get('up') or 0
                down = v.get('down') or 0
                summary[service]['up'] += up
                summary[service]['down'] += down

                out[service].append({'timestamp': ts.isoformat(),
                                     'region': v.get('region'),
                                     'up': up,
                                     'down': down})

            summary['all']['up'] += summary[service]['up']
            summary['all']['down'] += summary[service]['down']

        return {
            'summary': [
                summary
            ],
            'series': out
        }

    def query_metrics_nhours(self, hours=24, **kwargs):
        """
        Summary of up/down stats for last N hours.
        """
        stmt = f"""select
                 dimension,
                 region,
                  CASE
                    WHEN value = 0 THEN 'down'
                    ELSE 'up'
                  END status,
                  count(value) as "count"
                  from
                  cloud_monitor.metrics m
                  where
                  m.timestamp between now() - interval '{hours} hours' and now()
                  AND dimension not in ('Lambda Random Shade Generator', 'EC2 Bezos Quote Generator', 'S3 File Serving', 'SQS + EC2 Voting Game') AND dimension not like 'Monitor %'
                  GROUP BY
                  dimension,
                  region,
                  CASE
                    WHEN value = 0 THEN 'down'
                    ELSE 'up'
                  END
                  order by region, dimension asc;"""

        session = self.Session()
        return session.execute(stmt).fetchall()

    def query_metrics_overview(self):
        """
        An overview of services affected across regions in
            * the last 1 hour,
            * last 24 hours.

        Returns
        -------
        A sequence of
        {
         'region': 'region_name',
            '1h': {
                     up: 10,
                     down: 1,
                     services_affected': []
                   },
            '24h': {
                     up: 10,
                     down: 1,
                     services_affected': []
                    }
            }
        """
        def _process_rows(d, rows, label):
            for row in rows:
                dim, region, status, count = row

                if region not in d:
                    d[region]['1h'] = {'up': 0,
                                       'down': 0,
                                       'services_affected': []}
                    d[region]['24h'] = {'up': 0,
                                        'down': 0,
                                        'services_affected': []}

                d[region][label][status] += count

                if status == 'down':
                    d[region][label]['services_affected'].append(dim)

        last_1h = self.query_metrics_nhours(hours=1)
        last_24h = self.query_metrics_nhours(hours=24)

        d = defaultdict(lambda: defaultdict(dict))

        _process_rows(d, last_24h, '24h')
        _process_rows(d, last_1h, '1h')

        out = [{'region': k,
                '1h': v.get('1h', {}),
                '24h': v.get('24h', {})}
               for k, v in d.items()]
        return out
