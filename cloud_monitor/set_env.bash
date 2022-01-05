export DATABASE_URL=postgresql+psycopg2://postgres:test@localhost:5432/cloud_monitor
export DATABASE_URL_TESTS=postgresql+psycopg2://postgres:test@localhost:5432/cloud_monitor

# Taloflow monitoring apps
export TM_VOTING_API_URL=https://us-east-1.taloflow.ai
export TM_SHADES_URL=https://6bitdsm1cl.execute-api.us-east-1.amazonaws.com/prod/shades
export TM_BEZZOS_QUOTES_URL=https://us-east-1-quote-generator.taloflow.ai/quote
export TM_S3_FILE_URL=https://taloflow-aws-health-check.s3.amazonaws.com/if-i-get-requested-s3-is-up.jpg
export TM_REGION=us-east-1
export TM_SQS_SLEEP=10
export TM_VOTING_EC2_INSTANCE_ID=i-078xxxxxxxx
export TM_EC2_ENDPOINT_URL=https://ec2.us-east-1.amazonaws.com
export TM_AWS_ACCESS_KEY_ID=test
export TM_AWS_SECRET_ACCESS_KEY=test
export TM_DYNAMODB_ENDPOINT_URL=https://dynamodb.us-east-1.amazonaws.com
export TM_LAMBDA_ENDPOINT_URL=https://lambda.us-east-1.amazonaws.com
export API_CORS_ORIGINS=http://localhost:8000,https://localhost:8083
