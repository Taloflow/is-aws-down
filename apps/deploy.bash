# Script tto deploy all apps to an aws region. Set below env variables before
# running the script
# DYNAMODB_ENDPOINT_URL: Set region specific URL
# AWS_PROFILE: AWS credential profile for the region you are deploying to
# AWS_REGION
# AWS_PROFILE_US_EAST: For copying sources from us-east-1
set -euxo pipefail

home=`$pwd`

source dynamodb.bash

cd $home

source shades_lambda.bash

cd $home

source shades_api_gateway_export.bash

cd $home

source shades_api_gateway_import.bash

cd $home
