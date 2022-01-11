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
# The ENV variables VIRTUAL_HOST and LETSENCRYPT_HOST should point to the domain name for the API. 
sudo docker build -f api.DockerFile -t api .

# Start API server
sudo docker run -d --name api -p :80 --restart unless-stopped api
```

## Deploy to AWS App Runner

```bash
# install aws cli, create your aws profile  on local machine.

# Authenticate with ECR repo for Voting Game
aws ecr get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin <AWS Account ID>.dkr.ecr.us-east-1.amazonaws.com/voting-game

# We don't know whether AWS App Runner uses arm64 or amd64 architecture. So install buildx locally and create multi architecture images and manifest

# Prepare buildx instance and test multi platform support
sudo docker buildx create --name voting-game-multi-arch --use
sudo docker run --privileged --rm tonistiigi/binfmt --install all
sudo docker buildx inspect --bootstrap

# Build and push a multi platform image
sudo docker buildx build --platform linux/amd64,linux/arm64 -f  api.DockerFile -t "<AWS Account ID>.dkr.ecr.us-east-1.amazonaws.com/voting-game:latest" --push .

# Inspect images
aws ecr describe-images --repository-name voting-game

# Inspect manifest
sudo  docker manifest inspect <AWS Account ID>.dkr.ecr.us-east-1.amazonaws.com/voting-game
```

### Create AWS App Runner service for Voting Game API

* Enable automatic deployments and select 'AppRunnerECRAccessRole'
* Security: Assign an instance role with privileges for DynamoDB, SQS and EC2. This role credentials will be assumed by app run instance. DynamoDB and SQS boto clients in our app obtain  credentials from env variables or ec2 metadata service. 
* The default entrypoint command in api.Dockerfile used for building voting-game image points to api task. So no need to specify an entrypoint in App Runner service.

### Create AWS App Runner service for Voting Game SQS task processor

* Similar steps as above
* Use below command to override entrypoint default in docker image.
```
dramatiq voting_game.tasks.tasks -p 1 -t 1 --queues votes
```
* Use port number 9191 for the service. This is the default prometheus exposition server exposed by dramatiq task processor.  As App Runner is not built for running scheduled tasks or batch jobs as in GCP Cloud Scheduler, we will need to keep the service warm by polling port 9191 at the url /metrics.  GCP Cloud Monitor task we run polls this URL continuously. See the env variable ```TM_VOTES_PROMETHEUS_URL``` in cloud_monitor health check task.



### API

#### Topic

An example topic
```
{
	id: e84193f1-6299-4580-87ec-789b3ae3294b, // primary key for topics table
    created: 2021-12-28T00:36:04.520156,      // iso timestamp
    last_upd: 2021-12-28T00:36:04.520156,     
    is_active: true,                          
    title: "I want to quit working computers and become a ...",
    choices: [
       {
        id: 3df20871-0744-4f25-9b77-9c22218bc0f8,
        description: "Woodworker",
        votes: 33
       },
       {
        id: e801c63c-a7f8-4f8d-bd05-e492a857bd59,
        description: "Woodworker",
        votes: 67
       }
    ]
}
```

#### Methods

You can see the docs and execute against live DB using the swagger spec at API_URL/docs.  Below is a worked out example of a topic creation, update and vote. 

**POST /topics:** Create a topic

Request json format
```
{
  "is_active": true,
  "title": "I want to quit working computers and become a ...",
  "choices": [
    {
      "description": "Woodworker"
    },
    {
      "description": "Baker"
    },
    {
      "description": "Farmer"
    }
  ]
}
```

Successful response: HTTP 201 Created

```
{
  "id": "ecea1557-4763-4f7b-b218-8af55294667c",
  "created": "2021-12-28T00:48:55.871230",
  "last_upd": "2021-12-28T00:48:55.871238",
  "is_active": true,
  "title": "I want to quit working computers and become a ...",
  "choices": [
    {
      "id": "6042f664-fac3-4c4a-bf3d-9646b33f9d73",
      "description": "Woodworker",
      "votes": null
    },
    {
      "id": "77c4a8ff-48cf-4f47-9c89-007ccfe487fe",
      "description": "Baker",
      "votes": null
    },
    {
      "id": "5e3fc1b1-6a6d-4aa8-b8e2-4454aeadb1d5",
      "description": "Farmer",
      "votes": null
    }
  ]
}
```

**PUT /topics/{id}:** Update existing topics.

You can update:

    * title
    * is_active
    * choices.description

PUT /topics/ecea1557-4763-4f7b-b218-8af55294667c

```
{
  "is_active": false,
  "title": "I want to quit working computers and become a:",
  "choices": [
    {
      "id": "6042f664-fac3-4c4a-bf3d-9646b33f9d73",
      "description": "Woodworker"
    },
    {
      "id": "77c4a8ff-48cf-4f47-9c89-007ccfe487fe",
      "description": "Baker"
    },
    {
      "id": "5e3fc1b1-6a6d-4aa8-b8e2-4454aeadb1d5",
      "description": "Organic Farmer"
    },
    {
      "description": "Chef"
    }
  ]
}
```

Here

    * Successful response: HTTP 200. Body will be null as this is PUT
    * Choices array will be replaced by the array you provide:
        * Chef will be assigned an id as we are adding a new one. 
        * Keep the other ids exactly as you received from GET /topics as votes may already have been recorded against them.


**GET /topics:** get all topics. 
**GET /topics/{id}:** Get specific topic by id.

For both methods, add a url param include_votes=true if you require votes to be calculated for each topic.

GET /topics?include_votes=true

```
[
  {
    "created": "2021-12-28T00:48:55.871230",
    "is_active": false,
    "id": "ecea1557-4763-4f7b-b218-8af55294667c",
    "last_upd": "2021-12-28T00:48:55.871238",
    "choices": [
      {
        "description": "Woodworker",
        "votes": 0,
        "id": "6042f664-fac3-4c4a-bf3d-9646b33f9d73"
      },
      {
        "description": "Baker",
        "votes": 0,
        "id": "77c4a8ff-48cf-4f47-9c89-007ccfe487fe"
      },
      {
        "description": "Organic Farmer",
        "votes": 0,
        "id": "5e3fc1b1-6a6d-4aa8-b8e2-4454aeadb1d5"
      },
      {
        "description": "Chef",
        "votes": 0,
        "id": "f3d75639-691a-47a5-8b46-beeb12ea2d3e"
      }
    ],
    "title": "I want to quit working computers and become a:"
  }
]
```

**POST /votes**: Records a vote against a topic_id, choice_id.

```
{
  "topic_id": "ecea1557-4763-4f7b-b218-8af55294667c",
  "choice_id": "6042f664-fac3-4c4a-bf3d-9646b33f9d73"
}
```

Successful response: HTTP 202 Accepted. This will be queued at SQS to be picked up and processed by task processor into DynamoDB.

```
{
  "id": "5f88882c-a3a3-417d-aab9-75ba337ceb47",
  "topic_id": "ecea1557-4763-4f7b-b218-8af55294667c",
  "choice_id": "6042f664-fac3-4c4a-bf3d-9646b33f9d73",
  "queued_at": "2021-12-28T01:15:40.314062"
}
```

Here you get HTTP 202 as we are deliberately involving SQS. The vote record is enqueued in SQS for asynchronous processing. 

When the processing is complete and record is in DynamoDB, you can see it by GET /votes/{id}. The request will return HTTP 200 when the vote has reached db.

```
{
  "created": "2021-12-28T01:15:40.399351",
  "topic_id": "ecea1557-4763-4f7b-b218-8af55294667c",
  "id": "5f88882c-a3a3-417d-aab9-75ba337ceb47",
  "choice_id": "6042f664-fac3-4c4a-bf3d-9646b33f9d73"
}
```