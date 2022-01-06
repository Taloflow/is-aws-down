import logging
import os
import sys
import dramatiq
from dramatiq.middleware import (AgeLimit, TimeLimit, Callbacks, Pipelines,
                                 Retries)
from dramatiq_sqs import SQSBroker
from voting_game.model import dynamodb, base


logger = logging.getLogger()
handler = logging.StreamHandler(sys.stdout)
formatter = logging.Formatter(fmt=u'%(asctime)s %(lineno)d %(message)s',
                              datefmt=u'%d-%m-%Y %H:%M:%S')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)


broker = SQSBroker(
    namespace="dramatiq_sqs_voting_game",
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    region_name=os.environ['AWS_REGION'],
    endpoint_url=os.environ['AWS_SQS_ENDPOINT_URL'],
    middleware=[
        AgeLimit(),
        TimeLimit(),
        Callbacks(),
        Pipelines(),
        Retries(min_backoff=1000, max_backoff=900000, max_retries=96),
    ],
)
dramatiq.set_broker(broker)


db = dynamodb.DynamoDBModel(
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    region_name=os.environ['AWS_REGION'],
    endpoint_url=os.environ['DYNAMODB_ENDPOINT_URL']
)


@dramatiq.actor(max_retries=10, time_limit=86400000, queue_name='votes')
def process_vote(id, topic_id, choice_id):
    try:
        vote = base.Vote(id=id, topic_id=topic_id, choice_id=choice_id)
        db.cast_vote(vote)
    except Exception:
        logger.exception(f'Error inserting vote {vote}')
        raise
