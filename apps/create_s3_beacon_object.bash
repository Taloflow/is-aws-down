dest=taloflow-aws-health-check-$AWS_REGION

aws --profile $AWS_PROFILE s3 mb s3://$dest

aws --profile $AWS_PROFILE s3 sync s3://taloflow-aws-health-check s3://$dest --source-region us-east-1 

aws --profile $AWS_PROFILE s3api put-object-acl --bucket $dest --key if-i-get-requested-s3-is-up.jpg --acl public-read
