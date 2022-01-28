# alternative for Voting Game using ec2 as origin for cloudfront instead of app runner origin
# Env variables required
# ec2_public_dns_voting: public DNS assigned to Voting Game EC2 server
# AWS_REGION

echo "Create Cloudfront distribution with EC2 as origin"
echo "If Cloudshield doesn't exist in current region, manually edit _temp_cf_voting_api_alt.json to use us-east-1 as shield orgin"


caller_ref=`uuidgen`
cat cloudfront_voting_api_template_alt.json | sed "s/EC2_DOMAIN_VOTING_API/$ec2_public_dns_voting/g" | sed "s/AWS_REGION/$AWS_REGION/g" | sed "s/CALLER_REF/$caller_ref/g" > _temp_cf_voting_api_alt.json

aws --profile $AWS_PROFILE cloudfront create-distribution \
    --cli-input-json file://_temp_cf_voting_api_alt.json

