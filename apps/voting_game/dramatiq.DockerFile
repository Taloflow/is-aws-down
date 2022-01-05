FROM python:3.9
WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./voting_game /code/voting_game

ENV DYNAMODB_ENDPOINT_URL https://dynamodb.us-east-1.amazonaws.com
ENV AWS_ACCESS_KEY_ID test-key
ENV AWS_SECRET_ACCESS_KEY test-key
ENV AWS_REGION us-east-1
ENV API_CORS_ORIGINS https://taloflow.ai,https://www.taloflow.ai
ENV AWS_SQS_ENDPOINT_URL https://sqs.us-east-1.amazonaws.com

CMD ["dramatiq", "voting_game.tasks.tasks", "-p", "1", "-t", "1", "--queues", "votes"]
