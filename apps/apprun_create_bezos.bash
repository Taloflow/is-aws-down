# Deploy Bezos quote generator as an AWS App Runner service.
# Before running this ensure that ECR replication is turned on for all relevant
# regions. 
aws --profile=$AWS_PROFILE apprunner create-service \
    --cli-input-json file://apprunner_bezos.json

echo "App Runner service will take 10 minutes or more to complete. Run CloudFront creator after checking App runner service is up"

sleep 300

