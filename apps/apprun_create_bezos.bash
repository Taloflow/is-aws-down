# Deploy Bezos quote generator as an AWS App Runner service.
# Before running this ensure that ECR replication is turned on for all relevant
# regions. 
cat apprunner_bezos.json | sed "s/us-east-1/$AWS_REGION/g" | sed "s/AWS_ACCOUNT_ID/$AWS_ACCOUNT_ID/g" > _temp_apprunner_bezos.json

aws --profile=$AWS_PROFILE apprunner create-service \
    --cli-input-json file://_temp_apprunner_bezos.json

echo "App Runner service will take 10 minutes or more to complete. Run CloudFront creator after checking App runner service is up"

sleep 300

