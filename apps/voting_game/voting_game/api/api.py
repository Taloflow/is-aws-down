from fastapi import Depends, FastAPI, Request, status, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from voting_game.model import base, dynamodb
from voting_game.tasks import tasks
import logging
import os
import sys

logger = logging.getLogger()
handler = logging.StreamHandler(sys.stdout)
formatter = logging.Formatter(fmt=u'%(asctime)s %(lineno)d %(message)s',
                              datefmt=u'%m-%d-%Y %H:%M:%S')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ['API_CORS_ORIGINS'].split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SecureTopic(base.Topic):
    api_key: str


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request,
                                       exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


def get_db():
    return dynamodb.DynamoDBModel(
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        aws_session_token=os.environ['AWS_SESSION_TOKEN'],
        region_name=os.environ['AWS_REGION'],
        endpoint_url=os.environ['DYNAMODB_ENDPOINT_URL']
    )


@app.post('/topics', status_code=status.HTTP_201_CREATED)
def post_topics(topic: SecureTopic, db=Depends(get_db)):
    if not topic.api_key == os.environ['API_KEY']:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # hack to strip out system fields - created, id, last_upd etc.
    topic = base.Topic(is_active=topic.is_active,
                       title=topic.title,
                       choices=topic.choices)

    r = db.insert_topics(topic)
    if r['ResponseMetadata']['HTTPStatusCode'] == 200:
        return topic

    raise HTTPException(status_code=500, detail="Error inserting topic")


@app.put('/topics/{id}', status_code=200)
def put_topics(topic: SecureTopic, id: str, db=Depends(get_db)):
    if not topic.api_key == os.environ['API_KEY']:
        raise HTTPException(status_code=401, detail="Not authenticated")

    topic = base.Topic(id=id,
                       is_active=topic.is_active,
                       title=topic.title,
                       choices=topic.choices)
    db.update_topics(topic)


@app.get('/topics')
def get_topics(response: Response, include_votes: bool=False,
               db=Depends(get_db)):
    response.headers['Cache-Control'] = ('public, max-age=1, s-maxage=1'
                                         ', stale-while-revalidate=120'
                                         ', stale-if-error=120')
    r = db.query_topics(include_votes=include_votes)
    return r


@app.get('/topics/{id}')
def get_topics_by_id(response: Response, id: str, include_votes: bool=False,
                     db=Depends(get_db)):
    response.headers['Cache-Control'] = ('public, max-age=1, s-maxage=1'
                                         ', stale-while-revalidate=120'
                                         ', stale-if-error=120')
    r = db.query_topics(id=id, include_votes=include_votes)
    return r


@app.post('/votes', status_code=status.HTTP_202_ACCEPTED)
def enqueue_votes(vote: base.Vote, db=Depends(get_db)):
    tasks.process_vote.send(id=vote.id,
                            topic_id=vote.topic_id,
                            choice_id=vote.choice_id)
    r = vote.dict()
    r['queued_at'] = r['created']
    del r['created']
    return r


@app.get('/votes/{id}')
def get_votes_by_id(response: Response, id: str, db=Depends(get_db)):
    response.headers['Cache-Control'] = ('public, max-age=5, s-maxage=5'
                                         ', stale-while-revalidate=120'
                                         ', stale-if-error=120')
    r = db.query_votes(id=id)
    return r


@app.get('/votes')
def get_votes_by_topic(response: Response, topic_id: str, db=Depends(get_db)):
    response.headers['Cache-Control'] = ('public, max-age=5, s-maxage=5'
                                         ', stale-while-revalidate=120'
                                         ', stale-if-error=120')
    r = db.query_votes(topic_id=topic_id)
    return r
