import pytest
import os
import uuid
import random
from datetime import datetime
from cloud_monitor.model import model


@pytest.fixture(scope='class')
def db():
    # 'postgresql+psycopg2://postgres:test@localhost:5434/geofilter'
    db = model.Model(os.environ['DATABASE_URL_TESTS'])
    session = db.Session()
    yield db
    session.rollback()


class TestModel(object):
    def test_insert_query_metrics(self, db):
        data = {
            'timestamp': datetime.utcnow(),
            'dimension': str(uuid.uuid4()),
            'region': str(uuid.uuid4()),
            'value': random.choice([0, 1]),
            'response_time': random.randint(0, 100)
        }

        inserted_metric = db.insert_metrics(commit=False, **data)
        print(inserted_metric.timestamp)

        metric_from_db = db.query_metrics(id=inserted_metric.id)[0]

        assert (data['timestamp'] == inserted_metric.timestamp ==
                metric_from_db.timestamp)
        assert (data['dimension'] == inserted_metric.dimension ==
                metric_from_db.dimension)
        assert (data['region'] == inserted_metric.region ==
                metric_from_db.region)
        assert (data['response_time'] == inserted_metric.response_time ==
                metric_from_db.response_time)

    def test_insert_update_query_users(self, db):
        alert_cadence = [1, 5, 10]
        data = {
            'signup_for': [str(uuid.uuid4()), str(uuid.uuid4())],
            'service_alerts': [str(uuid.uuid4()), str(uuid.uuid4()),
                               str(uuid.uuid4())],
            'alert_cadence': 'every',
            'email': str(uuid.uuid4())
        }

        inserted_user = db.insert_users(commit=False, **data)

        alert_cadence.pop()
        updated_user = db.update_users(commit=False, id=inserted_user.id,
                                       alert_cadence=alert_cadence)

        user_from_db = db.query_users(id=inserted_user.id)[0]

        assert user_from_db.email == inserted_user.email == data['email']
        assert (user_from_db.service_alerts == inserted_user.service_alerts ==
                data['service_alerts'])
        assert (user_from_db.alert_cadence == updated_user.alert_cadence ==
                alert_cadence)
