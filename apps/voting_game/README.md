# EC2 + SQS + DynamoDB Voting Game

A voting game with below AWS components:

* EC2: backend api, Python + FastAPI
* SQS: tasks queue
* DynamoDB: database

## Dev setup
```bash 
# install poetry and then
poetry shell
poetry install

# Start a local dynamodb instance
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

# Create dynamodb tables using aws cli
cd voting_game/model/ddl
aws dynamodb create-table --cli-input-json file://topics.json --endpoint-url http://localhost:8000
aws dynamodb create-table --cli-input-json file://votes.json --endpoint-url http://localhost:8000

# Start an ElastiqMQ instance(for SQS)
wget https://s3-eu-west-1.amazonaws.com/softwaremill-public/elasticmq-server-1.3.3.jar
java -jar elasticmq-server-1.3.3.jar

# update set_env.bash with your environment variables
export DYNAMODB_ENDPOINT_URL=http://localhost:8000 
export DYNAMODB_ENDPOINT_URL_TESTS=http://localhost:8000  # DynamoDB local for dev
export AWS_ACCESS_KEY_ID=test # Any key works with DynamoDB local
export AWS_SECRET_ACCESS_KEY=test
export AWS_REGION=us-east-1
export API_CORS_ORIGINS=http://localhost:8000,https://localhost:8083
export AWS_SQS_ENDPOINT_URL=http://127.0.0.1:9324 # ElastiqMQ for local testing
export API_KEY=test_key # a url safe token for api

# load your env
source set_env.bash
source set_pythonpath.bash

# Start SQS task processor
poetry run dramatiq voting_game.tasks.tasks -p 1 -t 1 --queues votes

# Start API
poetry run uvicorn voting_game.api.api:app --reload
```

## Deployment

### AWS setup

Grant _AmazonDynamoDBFullAccess_ policy to your IAM user or read/write/table creation permissions in a restricted policy. Create table using the commands above.

### Deploy to an EC2 server

```bash
# Start an NGINX reverse proxy server with ACME companion to generate letsencrypt certificates

# reverse proxy
sudo docker run --detach \
    --name nginx-proxy \
    --publish 80:80 \
    --publish 443:443 \
    --volume certs:/etc/nginx/certs \
    --volume vhost:/etc/nginx/vhost.d \
    --volume html:/usr/share/nginx/html \
    --volume /var/run/docker.sock:/tmp/docker.sock:ro \
    --restart unless-stopped \
    nginxproxy/nginx-proxy

# ACME companion for letsencrypt
sudo docker run --detach \
    --name nginx-proxy-acme \
    --volumes-from nginx-proxy \
    --volume /var/run/docker.sock:/var/run/docker.sock:ro \
    --volume acme:/etc/acme.sh \
    --env "DEFAULT_EMAIL=youremail@taloflow.ai" \
    nginxproxy/acme-companion


# clone the repo to an EC2 server and then build docker images.

# export python requirements
poetry export -f requirements.txt --output requirements.txt

# Build docker image for SQS task processor
# Update dramatiq.DockerFile ENV variables
sudo docker build -f dramatiq.DockerFile -t dramatiq .

# Start task processor
sudo docker run -d --name dramatiq --restart unless-stopped dramatiq

# Build docker image for API
# Update ENV variables in api.DockerFile
sudo docker build -f api.DockerFile -t api .

# Start API server
sudo docker run -d --name api -p :80 --restart unless-stopped api
```
