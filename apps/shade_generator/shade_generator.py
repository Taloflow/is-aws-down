import logging
import sys
import json
import random

logger = logging.getLogger()
logger.propagate = False
handler = logging.StreamHandler(sys.stdout)
formatter = logging.Formatter(fmt=u'%(asctime)s %(message)s',
                              datefmt=u'%d-%m-%Y %H:%M:%S')
handler.setFormatter(formatter)
logger.addHandler(handler)


with open('./shades.json', 'rt') as f:
    shades = json.load(f)


def lambda_handler(event, context):
    random_index = random.randint(0, len(shades) - 1)
    random_shade = shades[random_index]
    r = {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': 'https://www.taloflow.ai',
            'Access-Control-Allow-Methods': 'OPTIONS,GET'
        },
        'body': random_shade
    }
    return json.dumps(r, ensure_ascii=False).encode('utf-8')
