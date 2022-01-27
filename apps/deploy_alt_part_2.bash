# # Alternative script - part 2 - to deploy all apps to an aws region when App Runner isn't availabe in that region.


# Export below env variables before running
# AWS_PROFILE: AWS credential profile for the region you are deploying to
# AWS_REGION
# AWS_PROFILE_US_EAST: For copying sources from us-east-1
# ec2_public_dns: Public DNS assigned to bezos server
# ec2_public_dns_voting: Public DNS assigned to voting server
# VOTING_API_KEY: Key for voting /POST method

set -euxo pipefail

source cloudfront_create_bezos_alt.bash 

source cloudfront_create_voting_api.bash

echo "Voting API key is set as -> $VOTING_API_KEY"

source post_topics_alt.bash 

source create_s3_beacon_object.bash