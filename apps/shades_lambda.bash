# deploy lambda service & add API gateway

cd shade_generator/

# Create a deplooyment bundle
zip -g shade_generator.zip shades.json
zip -g shade_generator.zip shade_generator.py

aws --profile $AWS_PROFILE \
    lambda create-function \
    --function-name shade_generator \
    --zip-file fileb://shade_generator.zip \
    --handler shade_generator.lambda_handler \
    --runtime python3.9 \
    --role arn:aws:iam::$AWS_ACCOUNT_ID:role/cdm-retool-lambda-role

sleep 60




