# Alternative script to deploy all apps to an aws region when App Runner isn't availabe in that region.

# Set below env variables before
# running the script
# DYNAMODB_ENDPOINT_URL: Set region specific URL
# AWS_PROFILE: AWS credential profile for the region you are deploying to
# AWS_REGION
# AWS_PROFILE_US_EAST: For copying sources from us-east-1
# AWS_ACCOUNT_ID:


set -euxo pipefail

wdir=`pwd`

echo "Create dynamodb tables"
source dynamodb.bash

cd $wdir

echo "Create shade generator lambda"
source shades_lambda.bash

cd $wdir


echo "Export shades API gateway settings"
source shades_api_gateway_export.bash

echo "Create shades API gateway"
source shades_api_gateway_import.bash

echo "Create EC2 server for Bezos Quote Generator"
source create_ec2_bezos.bash

echo "Exit part 1"




