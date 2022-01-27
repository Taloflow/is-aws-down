# Create an EC2 server from Voting Game golden AMI
# ensure below env variables are set
# sec_group_id
# AWS_PROFILE
# AWS_REGION
# AWS_ACCOUNT_ID

echo "Copy Golden AMI"
# copy AMI to new region
r=`aws --profile $AWS_PROFILE ec2 copy-image  \
    --description "Voting Game" \
    --name "Voting Game" \
    --source-image-id ami-01a154ea8fce63671 \
    --source-region us-east-1 `


ami_id=`echo $r | jq .ImageId | sed 's/\"//g'`

echo "AMI copied. Waiting for status to be available. Sleep 900"
sleep 900

cat userdata_voting.template | sed "s/AWS_REGION/$AWS_REGION/g" > _temp_userdata.txt
# Create ec2 instance
ec2_r=`aws --profile $AWS_PROFILE ec2 run-instances \
    --image-id $ami_id \
    --count 1 --instance-type t4g.small \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=project,Value=growth-marketing},{Key=Name,Value=Voting Game}]' \
    --iam-instance-profile "Arn=arn:aws:iam::${AWS_ACCOUNT_ID}:instance-profile/aws-health-check-apps-role" \
    --security-group-ids $sec_group_id \
    --user-data file://_temp_userdata.txt `

ec2_instance_id_voting=`echo $ec2_r | jq .Instances[0].InstanceId | sed 's/\"//g'`

echo "Instance ID created $ec2_instance_id_voting"

echo "Wait for public DNS to be assigend. Sleep ..."
sleep 180

export ec2_public_dns_voting=`aws --profile $AWS_PROFILE ec2 describe-instances \
    --filters Name=instance-id,Values=$ec2_instance_id_voting \
    | jq .Reservations[0].Instances[0].PublicDnsName | sed 's/\"//g'`

echo "Public DNS assigned $ec2_public_dns_voting"
echo "Check the env variable ec2_public_dns_voting -> $ec2_public_dns_voting. If null, obtain it from AWS console and set it before continuing with next step"

