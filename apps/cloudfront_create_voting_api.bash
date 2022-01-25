caller_ref=`uuidgen`
cat cloudfront_voting_api_template.json | sed "s/APP_RUNNER_DOMAIN_VOTING_API/$APP_RUNNER_DOMAIN_VOTING_API/g" | sed "s/AWS_REGION/$AWS_REGION/g" | sed "s/CALLER_REF/$caller_ref/g" > _temp_cf_voting_api.json

aws --profile $AWS_PROFILE cloudfront create-distribution \
    --cli-input-json file://_temp_cf_voting_api.json

sleep 300