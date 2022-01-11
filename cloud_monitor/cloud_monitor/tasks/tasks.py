"""
Tasks are executed within an HTTP service to allow this to be run from
serverless container environments.e.g; Google Cloud Scheduler.

Another option is to run an RPC server to start cron jobs.
"""
import logging
import sys
import os
import io
from fastapi import Depends, FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from cloud_monitor.tasks import taloflow_monitor as tm
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


if __name__ == '__main__':
    db = get_db()
    task_runner(db)
