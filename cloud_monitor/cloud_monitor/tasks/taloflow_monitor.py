# -*- coding: utf-8 -*
"""
Defines functions that monitors taloflow apps. Each functon should return an
iterable of metrics in the form:
    [timestamp, dimension, region, value, response_time]
    [timestamp, EC2, us-east-1, 0, 100]

here:
    timestamp: datetime with timezone
    dimension: string, e.g.; EC2
    region: string, e,g.; us-east-1
    value: integer, 0: down(or error), 1: up
    response_time: integer, milliseconds. Can be null.
"""
import logging
import os
import requests
import json
import random
import time
import boto3
from datetime import timedelta, datetime


logger = logging.getLogger()


def ping_iam():
    """
    Call an IAM API method and see if you get a response. IAM doesn't really
    have regions. All global services run from us-east-1. Assuming that is the
    case with IAM too.

    Returns: True if IAM returns a response
    """
    iam = boto3.client(
        'iam',
        aws_access_key_id=os.environ['TM_AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['TM_AWS_SECRET_ACCESS_KEY']
    )

    r = iam.get_access_key_last_used(
        AccessKeyId=os.environ['TM_AWS_ACCESS_KEY_ID']
    )

    return True if r.get('AccessKeyLastUsed') else False


def ping_dynamodb():
    """
    Query dynamodb as a simple test of availability.

    Returns: True if query returns record sets or False.
    """
    db = boto3.resource(
        'dynamodb',
        aws_access_key_id=os.environ['TM_AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['TM_AWS_SECRET_ACCESS_KEY'],
        region_name=os.environ['TM_REGION'],
        endpoint_url=os.environ['TM_DYNAMODB_ENDPOINT_URL']
    )
    table = db.Table('topics')
    response = table.scan(Limit=10)
    topics = response['Items']
    return True if len(topics) > 0 else False


def ping_ec2():
    """
    Check ec2 status using aws api.

    Returns: True if instance is running.
    """
    ec2 = boto3.resource(
        'ec2',
        aws_access_key_id=os.environ['TM_AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['TM_AWS_SECRET_ACCESS_KEY'],
        region_name=os.environ['TM_REGION'],
        endpoint_url=os.environ['TM_EC2_ENDPOINT_URL']
    )
    instance = ec2.Instance(os.environ['TM_VOTING_EC2_INSTANCE_ID'])
    return True if instance.state['Name'] == 'running' else False


def ping_lambda():
    """
    Check lambda status by invoking a function directly.

    Returns: True function ran successfully.
    """
    client = boto3.client(
        'lambda',
        aws_access_key_id=os.environ['TM_AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['TM_AWS_SECRET_ACCESS_KEY'],
        region_name=os.environ['TM_REGION'],
        endpoint_url=os.environ['TM_LAMBDA_ENDPOINT_URL']
    )

    r = client.invoke(FunctionName='shade_generator',
                      InvocationType='RequestResponse')

    if r['StatusCode'] == 200:
        return True


def get_iam(*args, **kwargs):
    """
    Call iam ping function.

    Returns
    -------
    a tuple (timestamp, response_time, 0 or 1, {})
    """
    logger.info('Test ping_IAM')

    t1 = datetime.utcnow()
    t2 = t1 + timedelta(seconds=1800)
    value = 0

    try:
        r = ping_iam()
        t2 = datetime.utcnow()

        logger.info(f'Response from ping_IAM  => {r}')

        if r:
            value = 1
    except Exception:
        logger.exception('Error in ping_IAM. Indicates an issue with IAM API')
    finally:
        response_time = (t2 - t1) / timedelta(milliseconds=1)

    return (t1,
            round(response_time),
            value,
            {})


def get_topic(api_url, **kwargs):
    """
    Get a topic

    Parameters
    ----------
    api_url: voting game api url

    Returns
    -------
    a tuple (timestamp, response_time, 0 or 1, {'topic_id': <topic id>,
                                                'choice_id': <choice_id>})
    """
    logger.info(f'Test get_topic')

    url = f'{api_url}/topics'

    t1 = datetime.utcnow()
    t2 = t1 + timedelta(seconds=1800)
    value = 0
    topic_id = None
    choice_id = None

    try:
        r = requests.get(url, params={'include_votes': 'false'})
        t2 = datetime.utcnow()

        logger.info(f'Response from create_topic GET => {r.status_code}')

        if r.status_code == 200:
            value = 1
            topic = json.loads(r.text)[0]
            topic_id = topic.get('id')
            choices = topic.get('choices', [])
            rand_index = random.randint(0, len(choices) - 1)
            choice_id = choices[rand_index]['id']
        else:
            raise RuntimeError('Unexpected response from get_topic')
    except Exception:
        logger.exception('Error in get_topic. Indicates issues with EC2 or'
                         ' DynamoDB')
    finally:
        response_time = (t2 - t1) / timedelta(milliseconds=1)

    return (t1,
            round(response_time),
            value,
            {'topic_id': topic_id, 'choice_id': choice_id})


def post_vote(api_url, topic_id=None, choice_id=None, **kwargs):
    """
    Posts and vote checks if the vote has been successfully queued at SQS

    Parameters
    ----------
    api_url: voting game api url
    topic_id:
    choice_id:


    Returns
    -------
    a tuple (timestamp, response_time, 0 or 1, {'vote_id': <id>})
    """
    logger.info(f'Test post_vote')

    url = f'{api_url}/votes'

    payload = {
        'topic_id': topic_id,
        'choice_id': choice_id
    }

    t1 = datetime.utcnow()
    t2 = t1 + timedelta(seconds=1800)
    value = 0
    vote_id = None

    try:
        r = requests.post(url, data=json.dumps(payload), timeout=1800)
        t2 = datetime.utcnow()
        logger.info(f'Response from post_vote POST => {r.status_code}')

        if r.status_code == 202:
            value = 1
            vote_id = json.loads(r.text)['id']
        else:
            raise RuntimeError('Unexpected response from post_vote')
    except Exception:
        logger.exception('Error in post_vote. Indicates issues with EC2 '
                         'or SQS')
    finally:
        response_time = (t2 - t1) / timedelta(milliseconds=1)

    return (t1,
            round(response_time),
            value,
            {'vote_id': vote_id})


def get_vote(api_url, vote_id=None, **kwargs):
    """
    Queries given vote id to see if it has been processed from SQS into
    DynamoDB. Then remove the vote from db to prevent the table becoming too
    large because of health check api.

    Parameters
    ----------
    api_url: voting game api url
    vote_id: id

    Returns
    -------
    a tuple (timestamp, response_time, 0 or 1, {})
    """
    logger.info(f'Test get_topic')

    sleep_time = int(os.environ['TM_SQS_SLEEP'])
    logger.info(f'Sleeping for {sleep_time} seconds for SQS vote processor')
    time.sleep(sleep_time)

    url = f'{api_url}/votes/{vote_id}'

    t1 = datetime.utcnow()
    t2 = t1 + timedelta(seconds=1800)
    value = 0

    try:
        r = requests.get(url)
        t2 = datetime.utcnow()

        logger.info(f'Response from get_vote GET => {r.status_code}')

        if r.status_code == 200:
            value = 1

            r2 = requests.delete(url)
            logger.info(f'Response from DELETE vote => {r2.status_code}')

            if r2.status_code != 200:
                logger.info(r2.text)
                raise RuntimeError('Unexpected reponse from DELETE vote')

        else:
            raise RuntimeError('Unexpected response from get_vote')
    except Exception:
        logger.exception('Error in get_vote. Indicates issues with EC2 '
                         'SQS or DynamoDB')
    finally:
        response_time = (t2 - t1) / timedelta(milliseconds=1)

    return (t1,
            round(response_time),
            value,
            {})


def _simple_get(api_url, name, services=(), **kwargs):
    """
    Simple GET request check

    Parameters
    ----------
    api_url: api url
    name: a label for the current check
    service_label: a string. e.g.; 'API Gateway or Lambda'

    Returns
    -------
    a tuple (timestamp, response_time, 0 or 1, {})
    """
    logger.info(f'Test {name}')

    url = f'{api_url}'
    service_label = ' or '.join(services)

    t1 = datetime.utcnow()
    t2 = t1 + timedelta(seconds=1800)
    value = 0

    try:
        r = requests.get(url)
        t2 = datetime.utcnow()

        logger.info(f'Response from {name} GET => {r.status_code}')

        if r.status_code == 200:
            value = 1
        else:
            raise RuntimeError(f'Unexpected response from {name}')
    except Exception:
        logger.exception(f'Error in {name}. Indicates issues with '
                         f'{service_label}')
    finally:
        response_time = (t2 - t1) / timedelta(milliseconds=1)

    return (t1,
            round(response_time),
            value,
            {})


def get_shades(api_url, **kwargs):
    return _simple_get(api_url, 'get_shades', **kwargs)


def get_quotes(api_url, **kwargs):
    return _simple_get(api_url, 'get_quotes', **kwargs)


def get_s3_file(file_url, **kwargs):
    return _simple_get(file_url, 'get_s3_file', **kwargs)


def run_monitor_funcs(funcs, app_name, region, api_url):
    """
    Parameters
    ----------
    funcs: a tuple (function, [list of service descriptions'])

    Returns
    -------
    metrics: a list of metric lists.
    """
    logger.info(f'START monitor for app => {app_name}')

    aws_ping_funcs = {
        'EC2': ping_ec2,
        'DynamoDB': ping_dynamodb,
        'Lambda': ping_lambda,
        'IAM': ping_iam,
    }

    metrics = []

    data = {}
    for func, services in funcs:
        tstamp, resp_time, val, data = func(api_url, services=services,
                                            **data)
        metrics.append([tstamp, app_name, region, val, resp_time])

        # consider service is UP if app is UP. Else ping check to mark service
        # as UP or DOWN - a naive attempt to isolate app problems to a service.
        # To be improved later.
        for service in services:
            val_service = val

            try:
                if val == 0 and service in aws_ping_funcs:
                    ping_ok = aws_ping_funcs[service]()
                    val_service = 1 if ping_ok else 0
            except Exception:
                    val_service = 0
                    logger.exception(f'Error from ping {service}')

            service_status = 'UP' if val_service > 0 else 'DOWN'
            logger.info(f'{service} is {service_status}')
            metrics.append([tstamp, service, region, val_service, resp_time])

        app_status = 'UP' if val > 0 else 'DOWN'
        logger.info(f'Status of {app_name} => {app_status}')
    return metrics


def monitor_voting_app():
    metrics = []
    api_url = os.environ['TM_VOTING_API_URL']
    region = os.environ['TM_REGION']
    app_name = 'SQS + EC2 Voting Game'
    api_monitor_funcs = [(get_topic, ['EC2', 'DynamoDB']),
                         (post_vote, ['EC2', 'SQS']),
                         (get_vote, ['EC2', 'SQS', 'DynamoDB'])]
    metrics = run_monitor_funcs(api_monitor_funcs, app_name, region, api_url)
    return metrics


def monitor_shades_app():
    api_url = os.environ['TM_SHADES_URL']
    region = os.environ['TM_REGION']
    app_name = 'Lambda Random Shade Generator'
    api_monitor_funcs = [(get_shades, ['API Gateway', 'Lambda'])]
    metrics = run_monitor_funcs(api_monitor_funcs, app_name, region, api_url)
    return metrics


def monitor_quotes_app():
    api_url = os.environ['TM_BEZZOS_QUOTES_URL']
    region = os.environ['TM_REGION']
    app_name = 'EC2 Bezos Quote Generator'
    api_monitor_funcs = [(get_quotes, ['EC2'])]
    metrics = run_monitor_funcs(api_monitor_funcs, app_name, region, api_url)
    return metrics


def monitor_s3_file():
    api_url = os.environ['TM_S3_FILE_URL']
    region = os.environ['TM_REGION']
    app_name = 'S3 File Serving'
    api_monitor_funcs = [(get_s3_file, ['S3'])]
    metrics = run_monitor_funcs(api_monitor_funcs, app_name, region, api_url)
    return metrics


def monitor_iam():
    region = os.environ['TM_REGION']
    api_monitor_funcs = [(get_iam, ['IAM'])]
    metrics = run_monitor_funcs(api_monitor_funcs, 'IAM', region, None)
    return metrics
