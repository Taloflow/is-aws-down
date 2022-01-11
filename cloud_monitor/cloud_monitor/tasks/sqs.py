"""
Asychronous task processing using dramatiq with SQS as broker.
"""
import os
import dramatiq
from dramatiq.middleware import (AgeLimit, TimeLimit, Callbacks, Pipelines,
                                 Retries)
from dramatiq_sqs import SQSBroker

broker = SQSBroker(
    namespace="dramatiq_sqs_voting_game",
    aws_access_key_id=os.environ['TM_AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['TM_AWS_SECRET_ACCESS_KEY'],
    region_name=os.environ['TM_REGION'],
    endpoint_url=os.environ['TM_AWS_SQS_ENDPOINT_URL'],
    middleware=[
        AgeLimit(),
        TimeLimit(),
        Callbacks(),
        Pipelines(),
        Retries(min_backoff=1000, max_backoff=900000, max_retries=96)])

dramatiq.set_broker(broker)


@dramatiq.actor(max_retries=10, time_limit=60,
                queue_name='taloflow_monitor_sqs_ping')
def hello_sqs():
    return 'ok'
