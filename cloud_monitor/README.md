# Cloud health monitoring service

Check if a cloud service in a region is working by monitoring the uptime of sample applications. We are using below sample applications to monitor AWS service in us-east-1 region.

* [SQS + EC2 + DynamoDB voting game](../apps/voting_game/)
* [EC2 Bezos Quote Generator](../apps/bezos_quote_generator/)
* [Lambda Random Shade Generator](../apps/shade_generator/)
* S3 File Serving: Check if a file hosted in us-east-1 s3 bucket is accessible
* IAM: IAM doesn't have a region. We use AWS API to call an IAM method and look for expected fields in response.

## Dev setup
```bash 
# install poetry and then
poetry shell
poetry install

# update set_env.bash with your environment variables
export DATABASE_URL=postgresql+psycopg2://postgres:test@localhost:5432/cloud_monitor
export DATABASE_URL_TESTS=postgresql+psycopg2://postgres:test@localhost:5432/cloud_monitor

# Taloflow monitoring apps
export TM_VOTING_API_URL=https://us-east-1.taloflow.ai
export TM_SHADES_URL=https://6bitdsm1cl.execute-api.us-east-1.amazonaws.com/prod/shades
export TM_BEZZOS_QUOTES_URL=https://us-east-1-quote-generator.taloflow.ai/quote
export TM_S3_FILE_URL=https://taloflow-aws-health-check.s3.amazonaws.com/if-i-get-requested-s3-is-up.jpg
export TM_REGION=us-east-1
export TM_SQS_SLEEP=10
export TM_VOTING_EC2_INSTANCE_ID=i-XXXXXXXXXX
export TM_EC2_ENDPOINT_URL=https://ec2.us-east-1.amazonaws.com
export TM_AWS_ACCESS_KEY_ID=test
export TM_AWS_SECRET_ACCESS_KEY=test
export TM_DYNAMODB_ENDPOINT_URL=https://dynamodb.us-east-1.amazonaws.com
export TM_LAMBDA_ENDPOINT_URL=https://lambda.us-east-1.amazonaws.com
export API_CORS_ORIGINS=http://localhost:8000,https://localhost:8083

# load your env
source set_env.bash
source set_pythonpath.bash

# Create DB schema in postgresql 
poetry run alembic upgrade head

# Start the monitoring task.
# Here we expose an HTTP endpoint so that a serverless environment can invoke the task. e.g.; Google Cloud Scheduler
poetry run uvicorn cloud_monitor.tasks.tasks:app --reload

# Start API
poetry run uvicorn cloud_monitor.api.api:app --reload

```

## Structure:

* _cloud_monitor/model_: SQLAlchemy models for database. All SQL queries are here.
* _cloud_monitor/tasks_: Batch jobs to monitor sample applications/URLs.

    * tasks.py:

        * main task runner
        * exposes an HTTP endpoint so that serverless services e.g.; Google Cloud Scheduler can invoke it.
        * runs the monitoring functions specified in the task_runner.funcs list.
        * If you develop a new set of monitoring functions, add function names to task_runner.funcs list.
        * Your monitoring funcs should return iterables in the format
        ```
        (timestamp, service, region, service_status, response_time)
        ```
        Where
        ```
        timestamp: ISO 8601 timestamp
        service: name of the cloud service. e.g.; IAM
        service_status: 0 if service is down, else 1
        response_time: response time of the request in milliseconds.
        ```

* _cloud_monitor/api_: API server based on FastAPI and Pydantic. You can view the API spec and execute the HTTP calls at

    * Swagger console: \<API_URL\>/docs
    * Open API spec: \<API URL\>/redoc

* _alembic/_: Alembic is used for postgres database migrations. When you want to make schema changes, make the changes inside _cloud_monitor/model/model.py_ SQLAlchemy models. Then run alembic to create migration file.
```bash
# Generate migration file
poetry run alembic revision --autogenerate -m "Adding new column to metrics table"

# Apply migration
poetry run alembic upgrade head
```

## Deployment

Build and deploy as docker images using dockerfiles 

    * Cloud monitoring task: Dockerfile.taskrunner
    * API server: Dockerfile.api