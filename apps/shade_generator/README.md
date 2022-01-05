# Lambda Random Shade Generator

Displays random shades from a static file shades.json. Uses below AWS components
* Lambda
* API Gateway

# Deployment

## AWS setup

Add _AWSLambdaRole_ policy to your IAM user. Create an IAM role for lambda to assume when running the function.

```bash
# Add your shades to shades.json. Note that the file is utf-8 encoded for displaying emojis etc.

# Configure your AWS CLI profile to use the aws region your want the lambda function to run from.

# Create a deplooyment bundle
zip -g shade_generator.zip shades.json
zip -g shade_generator.zip shade_generator.py

# Create lambda function
aws --profile <your aws profile name> lambda create-function --function-name shade_generator --zip-file fileb://shade_generator.zip --handler shade_generator.lambda_handler --runtime python3.9 --role arn:aws:iam::25XXXXXXX91:role/cdm-XXXXXX-lambda-role

# Invoke the function and test 
aws --profile taloflow-us-east-1 lambda  invoke --function-name shade_generator outfile

# Update function code
aws --profile <your aws profile name> lambda update-function-code --function-name shade_generator --zip-file fileb://shade_generator.zip

# Create an API endpoint in API Gateway with GET and OPTIONS method. Enable CORS support using Mock integration.
```

**API URL**: https://\<your api endpoint\>.us-east-1.amazonaws.com/prod/shades

