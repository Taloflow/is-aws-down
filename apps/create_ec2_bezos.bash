# Create an EC2 server from Bezos Quote Generator golden AMI



# copy AMI to new region
r=`aws --profile $AWS_PROFILE ec2 copy-image  \
    --description "Bezos Quote Generator" \
    --name "Bezos Quote Generator" \
    --source-image-id ami-06db43e5adc190481 \
    --source-region us-east-1 `


ami_id=`echo $r | jq .ImageId | sed 's/\"//g'`

#wait till the image becomes available
aws --profile $AWS_PROFILE ec2 \
    wait image-available \
    --image-ids $ami_id


vpc_id=`aws --profile $AWS_PROFILE ec2 describe-vpcs \
    --filters Name=is-default,Values=true | jq  .Vpcs[0].VpcId | sed 's/\"//g'`

export sec_group_id=`aws --profile $AWS_PROFILE ec2 create-security-group \
    --group-name aws-health-check-apps \
    --description "Default security group for aws health check apps" \
    --vpc-id $vpc_id | jq .GroupId | sed 's/\"//g'`


# assign ingress rules
aws --profile $AWS_PROFILE ec2 \
     authorize-security-group-ingress \
     --group-id $sec_group_id \
     --protocol tcp --port 22 --cidr 0.0.0.0/0

aws --profile $AWS_PROFILE ec2 \
     authorize-security-group-ingress \
     --group-id $sec_group_id \
     --protocol tcp --port 80 --cidr 0.0.0.0/0

# prometheus exposition server
aws --profile $AWS_PROFILE ec2 \
     authorize-security-group-ingress \
     --group-id $sec_group_id \
     --protocol tcp --port 9191 --cidr 0.0.0.0/0


# Create ec2 instance
ec2_r=`aws --profile $AWS_PROFILE ec2 run-instances \
    --image-id $ami_id \
    --count 1 --instance-type t4g.micro \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=project,Value=growth-marketing},{Key=Name,Value=Bezos Quote Generator}]' \
    --iam-instance-profile "Arn=arn:aws:iam::${AWS_ACCOUNT_ID}:instance-profile/aws-health-check-apps-role" \
    --security-group-ids $sec_group_id `

ec2_instance_id=`echo $ec2_r | jq .Instances[0].InstanceId | sed 's/\"//g'`

#wait till the instance becomes available
aws --profile $AWS_PROFILE ec2 \
    wait instance-running \
    --instance-ids $ec2_instance_id



echo "Instance ID created $ec2_instance_id"

echo "Wait for public DNS to be assigend. Sleep ..."
sleep 180

export ec2_public_dns=`aws --profile $AWS_PROFILE ec2 describe-instances \
    --filters Name=instance-id,Values=$ec2_instance_id \
    | jq .Reservations[0].Instances[0].PublicDnsName | sed 's/\"//g'`

echo "Public DNS assigned $ec2_public_dns"
echo "Check the env variable ec2_public_dns -> $ec2_public_dns. If null, obtain it from AWS console and set it before continuing with next step"

