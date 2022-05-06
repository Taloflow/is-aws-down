"""
Tasks are executed within an HTTP service to allow this to be run from
serverless container environments.e.g; Google Cloud Scheduler.

Another option is to run an RPC server to start cron jobs.
"""
import logging
import sys
import os
import io
import base64
import json
from fastapi import Depends, FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from google.cloud import pubsub_v1
from unittest.mock import MagicMock
import customerio as cio


# boto tries to connect to SQS here. We don't want monitor tasks to fail
# because SQS is down.
try:
    from cloud_monitor.tasks import taloflow_monitor as tm
except Exception:
    sqs = MagicMock()
    sqs.hello_sqs.send = MagicMock(
        side_effect=RuntimeError('Could not connect to SQS')
    )

from cloud_monitor.model import model


logger = logging.getLogger()
handler = logging.StreamHandler(sys.stdout)
formatter = logging.Formatter(fmt=u'%(asctime)s %(message)s',
                              datefmt=u'%m-%d-%Y %H:%M:%S')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

logfile = io.StringIO()
file_handler = logging.StreamHandler(logfile)
formatter = logging.Formatter(fmt=u'%(asctime)s %(message)s',
                              datefmt=u'%m-%d-%Y %H:%M:%S')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ['API_CORS_ORIGINS'].split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request,
                                       exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


def get_db():
    return model.Model(os.environ['DATABASE_URL'])


def task_runner(db):
    """
    Runs monitoring tasks in sequence and updates mertics table.
    """
    logger.info('START monitor task runner')
    logger.info('... \n')

    funcs = [tm.monitor_voting_app,
             tm.monitor_shades_app,
             tm.monitor_quotes_app,
             tm.monitor_s3_file,
             tm.monitor_iam,
             tm.monitor_sqs,
             tm.monitor_ec2,
             tm.monitor_votes_processor]

    for func in funcs:
        try:
            for row in func():
                tstamp, service, region, val, resp_time = row
                db.insert_metrics(timestamp=tstamp,
                                  dimension=service,
                                  region=region,
                                  value=val,
                                  response_time=resp_time)
        except Exception:
            logger.exception(f'Error running monitoring func {func}')
        finally:
            logger.info('... \n')

    logger.info('END monitor task runner')


def get_topic_path(publisher):
    """
    Get topic path for google Pub Sub

    Keeping this simple as we use PubSub only for senidng alerts for now.
    """
    project_id = os.environ['GOOGLE_PROJECT_ID']
    topic_id = os.environ['GOOGLE_PUBSUB_TOPIC_ID']
    return publisher.topic_path(project_id, topic_id)


def post_topic(data):
    """
    Post a message to google Pub Sub topic
    """
    publisher = pubsub_v1.PublisherClient()
    topic_path = get_topic_path(publisher)
    message = json.dumps(data)
    future = publisher.publish(topic_path, message.encode('utf-8'))
    logger.info(f'Message published to topic. Message id {future.result()}')


def decode_pubsub_payload(message):
    """
    Parameters
    ----------
    message: message  from pub sub api POST body.

    Returns
    -------
    data as a python object.
    """
    logger.info(f'Processing message: {message}')

    if not message:
        logger.info('Empty pub sub message')
        return

    if not isinstance(message, dict) or 'data' not in message:
        logger.exception(f'Invalid pub sub format. Type {type(message)}')
        raise RuntimeError('Invalid message')

    data_str = base64.b64decode(message['data']).decode('utf-8')

    return json.loads(data_str)


def check_outage(db):
    """
    Check if there is any outage to alert on.
    """
    logger.info('START check_outage()')
    logger.info('... \n')

    window = os.environ['TM_ALERTS_OUTAGE_WINDOW']
    outages = [(x.dimension, x.region, x.count)
               for x in db.query_metrics_outages(minutes=window)]

    if not outages:
        logger.info('No outage to report')
        logger.info('END check_outage()')
        logger.info('... \n')
        return

    alert_recipients = set()
    for user in db.query_users():
        logger.info(f'User {user.id} '
                    f'email {user.email} '
                    f'service_alerts {user.service_alerts} '
                    f'service_regions {user.service_regions} '
                    f'cadence {user.alert_cadence}')
        for service, region, count in outages:
            logger.info(f'service {service}, rgn {region}, count {count}')

            if user.service_regions:
                is_subscribed_region = (True if region in user.service_regions
                                        else False)
            else:
                # null -> subscribed to all regions because a lot of users
                # registered when UI didn't let them specify a region. So let
                # them continue to receive alerts.
                is_subscribed_region = True

            if user.service_alerts:
                is_subscribed_alert = (True if service in user.service_alerts
                                       else False)
            else:
                is_subscribed_alert = False

            if is_subscribed_region and is_subscribed_alert:
                if count < 3:
                    if user.alert_cadence == 'every':
                        alert_recipients.add((str(user.id), user.email))
                        break
                else:
                    alert_recipients.add((str(user.id), user.email))
                    break

    logger.info(f'Outages to report {outages}')

    for _id, email in alert_recipients:
        logger.info(f'Alert to be sent to {email}')
        event = {'outages': outages,
                 'email': email,
                 'user_id': _id}
        post_topic(event)

    logger.info('END check_outage()')
    logger.info('... \n')


def send_email(message):
    """
    Consume pubsub event and send email via customer.io
    """
    event = decode_pubsub_payload(message)

    logger.info('Start send_email()')
    logger.info(f'Processing \n {event}')

    rows = []
    for service, region, count in event['outages']:
        row = (f'<div class="our-class"> {count} of our health checks for '
               f'{service} in AWS {region} failed. </div>')
        rows.append(row)

    with open(os.environ['TM_ALERTS_EMAIL_TEMPLATE'], 'rt') as f:
        templ = f.read()
        body = templ.replace('_OUTAGE_ROWS_', ''.join(rows))

    if os.environ['TM_ALERTS_TEST_MODE'] == "1":
        logger.info(f'Test mode ON. Sending to '
                    f'{os.environ["TM_ALERTS_TEST_EMAIL"]}')
        to = os.environ['TM_ALERTS_TEST_EMAIL']
        cid = os.environ['TM_ALERTS_TEST_EMAIL_CUSTOMER_ID']
    else:
        to = event['email']
        cid = event['user_id']

    api = cio.APIClient(os.environ['TM_ALERTS_CUSTOMER_IO_API_KEY'])

    message_id = os.environ['TM_ALERTS_TRANSACT_MESSAGE_ID']
    request = cio.SendEmailRequest(
        to=to,
        transactional_message_id=message_id,
        identifiers={'id': cid},
        _from=os.environ['TM_ALERTS_FROM_ADDR'],
        subject='AWS health checks failed',
        body=body
    )

    logger.info('Sending email')
    response = api.send_email(request)
    logger.info(f'Response from Customer.io {response}')

    logger.info('END send_email()')
    logger.info('... \n')


# default route. Not renaming now as its being used by many services.
@app.post('/tasks')
def get_metrics(db=Depends(get_db)):
    try:
        task_runner(db)
        return {
            'detail': {
                'status_code': 200,
                'log': logfile.getvalue()
            }
        }
    except Exception:
        raise HTTPException(status_code=500,
                            detail={'status_code': 500,
                                    'log': logfile.getvalue()})


@app.post('/trigger_alerts')
def trigger_alerts(db=Depends(get_db)):
    """
    Check if there were any outages and enqueue alert emails.
    """
    try:
        check_outage(db)
        return {
            'detail': {
                'status_code': 200,
                'log': logfile.getvalue()
            }
        }
    except Exception:
        logger.exception('Internal error')
        raise HTTPException(status_code=500,
                            detail={'status_code': 500,
                                    'log': logfile.getvalue()})


@app.post('/send_email')
async def send_email_post(request: Request):
    """
    Read from pubsub and email alerts.
    """
    try:
        payload = await request.json()
        send_email(payload.get('message'))
        return {
            'detail': {
                'status_code': 200,
                'log': logfile.getvalue()
            }
        }
    except Exception:
        logger.exception('Internal error')
        raise HTTPException(status_code=500,
                            detail={'status_code': 500,
                                    'log': logfile.getvalue()})


if __name__ == '__main__':
    db = get_db()
    task_runner(db)
