aws --profile $AWS_PROFILE_US_EAST \
    --region us-east-1 \
    apigateway get-export \
    --parameters extensions='integrations' \
    --rest-api-id 6bitdsm1cl \
    --stage-name prod \
    --export-type swagger \
    --accept application/yaml \
    shades_api.yaml
