# Export below env variables before running
# AWS_PROFILE: AWS credential profile for the region you are deploying to
# AWS_REGION
# AWS_PROFILE_US_EAST: For copying sources from us-east-1
# APP_RUNNER_DOMAIN_BEZOS: app runner allocated DNS

set -euxo pipefail

source cloudfront_create_bezos.bash 

source apprun_create_voting_api.bash

source cloudfront_create_voting_api.bash

source post_topics.bash 

source apprun_create_voting_task.bash

source create_ec2_beacon_server.bash 

source create_s3_beacon_object.bash