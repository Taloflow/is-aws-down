from fastapi import Depends, FastAPI, Request, status, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from datetime import datetime
from cloud_monitor.model import model
import logging
import os
import sys
import uuid

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

app.add_middleware(GZipMiddleware, minimum_size=1000)


class SignUpFor(str, Enum):
    actions_launch = 'actionsLaunch'
    taloflow_launch = 'taloflowLaunch'


class Services(str, Enum):
    sqs = 'SQS'
    iam = 'IAM'
    lambda_ = 'Lambda'
    s3 = 'S3'
    ec2 = 'EC2'


class AlertCadence(str, Enum):
    every = 'every'
    five_in_row = 'fiveInARow'


class UserRequest(BaseModel):
    signup_for: Optional[List[SignUpFor]] = None
    service_alerts: Optional[List[Services]] = None
    service_regions: Optional[List[str]] = None
    alert_cadence: Optional[AlertCadence] = None
    email: str


class UserResponse(UserRequest):
    id: uuid.UUID
    created: datetime
    last_upd: datetime

    class Config:
        orm_mode = True


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request,
                                       exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


def get_db():
    return model.Model(os.environ['DATABASE_URL'])


@app.get('/metrics')
def get_metrics(response: Response, exclude_apps: bool=True,
                groupby: str = 'hour', region: str = 'us-east-1',
                db=Depends(get_db)):
    """
    Accetable values for groupby: hour, minute
    """
    response.headers['Cache-Control'] = 'public, max-age=5, s-maxage=5'
    r = db.query_metrics_chartjs(serialize=True, exclude_apps=exclude_apps,
                                 groupby=groupby, region=region)
    return r


@app.post('/users',  status_code=status.HTTP_201_CREATED,
          response_model=UserResponse)
def post_users(user: UserRequest, db=Depends(get_db)):
    user_from_db = db.query_users(email=user.email)
    if user_from_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    return db.insert_users(**user.dict())


@app.get('/overview')
def get_overview(response: Response, db=Depends(get_db)):
    response.headers['Cache-Control'] = 'public, max-age=5, s-maxage=5'
    r = db.query_metrics_overview()
    return r
