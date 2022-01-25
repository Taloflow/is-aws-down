caller_ref=`uuidgen`
cat cloudfront_bezos_template.json | sed "s/APP_RUNNER_DOMAIN_BEZOS/$APP_RUNNER_DOMAIN_BEZOS/g" | sed "s/AWS_REGION/$AWS_REGION/g" | sed "s/CALLER_REF/$caller_ref/g" > _temp_cf_bezos.json

aws --profile $AWS_PROFILE cloudfront create-distribution \
    --cli-input-json file://_temp_cf_bezos.json

sleep 300
