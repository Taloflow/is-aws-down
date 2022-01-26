# Create a low cost ec2 server to act as beacon for EC2 health check ping.

ami_id=`aws --profile $AWS_PROFILE ssm get-parameters --names "/aws/service/ami-amazon-linux-latest/amzn2-ami-kernel-5.10-hvm-arm64-gp2" --query 'Parameters[0].[Value]' --output text`
aws --profile $AWS_PROFILE ec2 run-instances \
--image-id $ami_id \
--count 1 --instance-type t4g.nano \
--tag-specifications 'ResourceType=instance,Tags=[{Key=project,Value=growth-marketing},{Key=Name,Value=Beacon for is-aws-down}]'