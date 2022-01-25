# Export below env variables before running
# AWS_PROFILE: AWS credential profile for the region you are deploying to
# AWS_REGION
# AWS_PROFILE_US_EAST: For copying sources from us-east-1
# APP_RUNNER_DOMAIN_BEZOS: app runner allocated DNS

set -euxo pipefail

home=`$pwd`

source cloudfront_create_bezos.bash 




