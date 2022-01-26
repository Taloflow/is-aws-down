cat shades_api.yaml | sed 's/us-east-1/us-east-2/g' > shades_api_$AWS_REGION.yaml
r=`aws --profile $AWS_PROFILE apigateway import-rest-api \
    --parameters endpointConfigurationTypes=REGIONAL \
    --fail-on-warnings \
    --cli-binary-format raw-in-base64-out \
    --body "file://.//shades_api_$AWS_REGION.yaml"`
api_id=`echo $r | jq .id | sed 's/\"//g'`

sleep 10

aws --profile $AWS_PROFILE apigateway create-deployment \
    --rest-api-id $api_id \
    --stage-name prod \
    --stage-description 'Prod Stage' \
    --description 'First deployment to prod stage'

sleep 10

aws --profile $AWS_PROFILE lambda add-permission \
    --function-name shade_generator \
    --statement-id apigateway-$api_id \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:${AWS_REGION}:${AWS_ACCOUNT_ID}:$api_id/*/*/*"


