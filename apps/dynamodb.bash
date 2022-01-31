# Script tto deploy all apps to an aws region. Set below env variables before
# running the script
# DYNAMODB_ENDPOINT_URL: Set region specific URL
# AWS_PROFILE: AWS credential profile for the region you are deploying to
# AWS_ACCOUNT_ID

# Create dynamodb tables using aws cli
cd voting_game/voting_game/model/ddl
aws --profile $AWS_PROFILE dynamodb create-table --cli-input-json file://topics.json --endpoint-url $DYNAMODB_ENDPOINT_URL
aws --profile $AWS_PROFILE  dynamodb create-table --cli-input-json file://votes.json --endpoint-url $DYNAMODB_ENDPOINT_URL

