export DATABASE_URL=postgresql+psycopg2://postgres:test@localhost:5432/cloud_monitor
export DATABASE_URL_TESTS=postgresql+psycopg2://postgres:test@localhost:5432/cloud_monitor

# Taloflow monitoring apps
export TM_VOTING_API_URL=https://d20v1ybfoa2k7c.cloudfront.net
export TM_SHADES_URL=https://6bitdsm1cl.execute-api.us-east-1.amazonaws.com/prod/shades
export TM_BEZZOS_QUOTES_URL=https://d1e63eaqx0w02n.cloudfront.net/quote
export TM_S3_FILE_URL=https://taloflow-aws-health-check.s3.amazonaws.com/if-i-get-requested-s3-is-up.jpg
export TM_REGION=us-east-1
export TM_VOTING_EC2_INSTANCE_ID=i-078xxxxxxxx
export TM_EC2_ENDPOINT_URL=https://ec2.us-east-1.amazonaws.com
export TM_AWS_ACCESS_KEY_ID=test
export TM_AWS_SECRET_ACCESS_KEY=test
export TM_DYNAMODB_ENDPOINT_URL=https://dynamodb.us-east-1.amazonaws.com
export TM_LAMBDA_ENDPOINT_URL=https://lambda.us-east-1.amazonaws.com
export TM_AWS_SQS_ENDPOINT_URL=http://127.0.0.1:9324
export TM_VOTES_PROMETHEUS_URL=https://xkvhvukpvi.us-east-1.awsapprunner.com/metrics
export API_CORS_ORIGINS=http://localhost:8000,https://localhost:8083

# Taloflow alert email settings
export TM_ALERTS_OUTAGE_WINDOW=5
export TM_ALERTS_TEST_MODE=1
export TM_ALERTS_TEST_EMAIL=test@taloflow.ai
export TM_ALERTS_TEST_EMAIL_CUSTOMER_ID=UUID-224233-3434343-
export TM_ALERTS_CUSTOMER_IO_API_KEY=test
export TM_ALERTS_EMAIL_TEMPLATE=/Users/anujoy/GoogleDrive_CX/MyCode/Cartographix/taloflow/is-aws-down/cloud_monitor/email_template.html
export TM_ALERTS_TRANSACT_MESSAGE_ID=4
export TM_ALERTS_FROM_ADDR="Taloflow <team@taloflow.ai>"

# Pub sub credentials
export GOOGLE_APPLICATION_CREDENTIALS="/Users/anujoy/GoogleDrive_CX/MyCode/Cartographix/taloflow/is-aws-down/cloud_monitor/strange-retina-336712-ca73d3d1edb3.json"
export GOOGLE_PROJECT_ID=strange-retina-336712
export GOOGLE_PUBSUB_TOPIC_ID=alert_emails
