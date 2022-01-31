# alternative for Bezos using ec2 as origin for cloudfront instead of app runner origin
# Env variables required
# ec2_public_dns: public DNS assigned to Bezos EC2 server
# AWS_REGION

echo "Create Cloudfront distribution with EC2 as origin"
echo "If Cloudshield doesn't exist in current region, edit template json to use us-east-1 as shield orgin"


caller_ref=`uuidgen`
cat cloudfront_bezos_template_alt.json | sed "s/EC2_DOMAIN_BEZOS/$ec2_public_dns/g" | sed "s/AWS_REGION/$AWS_REGION/g" | sed "s/CALLER_REF/$caller_ref/g" > _temp_cf_bezos_alt.json

aws --profile $AWS_PROFILE cloudfront create-distribution \
    --cli-input-json file://_temp_cf_bezos_alt.json


