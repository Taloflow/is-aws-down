# Deploy Voting API as an AWS App Runner service.
# Before running this ensure that ECR replication is turned on for all relevant
# regions. 

cat apprunner_voting_api_template.json | sed "s/us-east-1/$AWS_REGION/g" | sed "s/VOTING_API_KEY/$VOTING_API_KEY/g" > _temp_apprun_voting_api.json

aws --profile=$AWS_PROFILE apprunner create-service \
    --cli-input-json file://_temp_apprun_voting_api.json

echo "App Runner service will take 10 minutes or more to complete. Run CloudFront creator after checking App runner service is up"

sleep 300

