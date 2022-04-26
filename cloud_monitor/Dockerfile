FROM python:3.9

RUN apt-get install -y libpq-dev

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./cloud_monitor /code/cloud_monitor

ENV DATABASE_URL postgresql+psycopg2://postgres:test@localhost:5432/cloud_monitor
ENV TM_AWS_ACCESS_KEY_ID test
ENV TM_AWS_SECRET_ACCESS_KEY test
ENV TM_VOTING_API_URL https://d20v1ybfoa2k7c.cloudfront.net
ENV TM_SHADES_URL https://6bitdsm1cl.execute-api.us-east-1.amazonaws.com/prod/shades
ENV TM_BEZZOS_QUOTES_URL https://d1e63eaqx0w02n.cloudfront.net/quote
ENV TM_S3_FILE_URL https://taloflow-aws-health-check.s3.amazonaws.com/if-i-get-requested-s3-is-up.jpg
ENV TM_REGION us-east-1
ENV TM_VOTING_EC2_INSTANCE_ID i-xxxxxxxxxxxxxx
ENV TM_EC2_ENDPOINT_URL https://ec2.us-east-1.amazonaws.com
ENV TM_DYNAMODB_ENDPOINT_URL https://dynamodb.us-east-1.amazonaws.com
ENV TM_LAMBDA_ENDPOINT_URL https://lambda.us-east-1.amazonaws.com
ENV API_CORS_ORIGINS https://www.taloflow.ai,http://taloflow.ai
ENV TM_AWS_SQS_ENDPOINT_URL=https://sqs.us-east-1.amazonaws.com
ENV TM_VOTES_PROMETHEUS_URL=https://xkvhvukpvi.us-east-1.awsapprunner.com/metrics

EXPOSE 80

CMD ["uvicorn", "cloud_monitor.tasks.tasks:app", "--host", "0.0.0.0", "--port", "80", "--proxy-headers"]
