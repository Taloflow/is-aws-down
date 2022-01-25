# Script tto deploy all apps to an aws region. Set below env variables before
# running the script
# DYNAMODB_ENDPOINT_URL: Set region specific URL
# AWS_PROFILE: AWS credential profile for the region you are deploying to
# AWS_REGION
# AWS_PROFILE_US_EAST: For copying sources from us-east-1
set -euxo pipefail

wdir=`$pwd`

source dynamodb.bash

cd $wdir

source shades_lambda.bash

cd $wdir

source shades_api_gateway_export.bash

source shades_api_gateway_import.bash

source apprun_create_bezos.bash

echo "Exiting deploy part 1. Run deploy part 2 after App Runner deployment is complete"


