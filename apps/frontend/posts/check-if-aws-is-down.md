## How To Check If AWS Is Down, Or If It's Just You
This post covers troubleshooting tips to check if the following AWS services are down:

- Lambda
- EC2
- S3
- SQS

[comment]: <> (TODO: Add dynamo and RDS)
[comment]: <> (- DynamoDB)

[comment]: <> (- RDS)

### Checking if Lambda Is Down

There are three debugging steps for checking if Lambda is up:

1. Invoking the Lambda via the CLI
2. Check Cloudwatch logs
3. Check CloudWatch metrics

#### Invoking via the CLI

Here's the format for invoking your Lambda:

```
aws --profile <aws profile> lambda invoke \
  --function-name <lambda function name> \
  --invocation-type RequestResponse \
  --log-type Tail 
   <outfile name>
```

Here's an example for one of our services:

```
aws --profile taloflow-us-east-1 lambda invoke \
    --function-name shade_generator \
    --invocation-type RequestResponse \
    --log-type Tail \
     --cli-binary-format raw-in-base64-out \
    response.json
```

You should see some sort of response print in your console if your Lambda is active.

#### Checking Cloudwatch logs

Before you can check logs in CloudWatch, you need to get the log group name for your lambda function.

```
# Get log group name for your lambda function
aws --profile taloflow-us-east-1 logs describe-log-groups \
  --query logGroups[*].logGroupName | grep lambda | grep <lambda function name>
```

Like:

```
aws --profile taloflow-us-east-1 logs describe-log-groups \
--query logGroups[*].logGroupName | grep lambda | grep shade_generator

output >>> "/aws/lambda/shade_generator"
```

Using the log group name, get the last 10 log streams (replace with your own `--log-group-name` and `--profile`):

```
# Get the last 10 log streams for the log group
aws --profile taloflow-us-east-1 logs describe-log-streams \
  --log-group-name "/aws/lambda/shade_generator" \
  --query logStreams[*].logStreamName \
  --order-by  LastEventTime \
  --descending \
  --max-items 10

output >>>

[
    "2022/02/06/[$LATEST]b581a86c270941a89f7864ffadb5bc0c",
    "2022/02/06/[$LATEST]2f739299c1524f4d8b54555298a799b2",
    "2022/02/06/[$LATEST]2497a4fca4294b1f88d705c3a72e31c6",
    "2022/02/06/[$LATEST]68493bb048dc4ad39459ad1bac5f55c4",
    "2022/02/06/[$LATEST]00963a7d598b4915bca8e8b1947c125d",
    "2022/02/06/[$LATEST]97ac0e11979e4c939e1dff5f90f79704",
    "2022/02/06/[$LATEST]581b66dcaf4440d2ab23355a11441fd8",
    "2022/02/06/[$LATEST]75c3a7a9b1db45c3a0bea99d14bdb237",
    "2022/02/06/[$LATEST]34ffb419d3e342bb814146a8c035c330",
    "2022/02/06/[$LATEST]48c28a6dccbd4203b98a5675163bf144"
]
```

Using those ids, you can  Note the key metrics in the log events:

- Duration: Time it took to execute the lambda function and return the result
- Memory Size: Allocated to the lambda
- Max Memory Used: Memory used by the invocation

```
# Get log events from the log stream
aws --profile taloflow-us-east-1 logs get-log-events \
    --log-group-name "/aws/lambda/shade_generator" \
    --log-stream-name '2022/02/06/[$LATEST]48c28a6dccbd4203b98a5675163bf144'

output >>>
{
    "events": [
        {
            "timestamp": 1644125701434,
            "message": "START RequestId: f59ed9cc-6ed8-473c-87a8-638eae0963e4 Version: $LATEST\n",
            "ingestionTime": 1644125710504
        },
        {
            "timestamp": 1644125701437,
            "message": "END RequestId: f59ed9cc-6ed8-473c-87a8-638eae0963e4\n",
            "ingestionTime": 1644125710504
        },
        {
            "timestamp": 1644125701437,
            "message": "REPORT RequestId: f59ed9cc-6ed8-473c-87a8-638eae0963e4\tDuration: 0.80 ms\tBilled Duration: 1 ms\tMemory Size: 128 MB\tMax Memory Used: 40 MB\t\n",
            "ingestionTime": 1644125710504
        },
```

#### Checking Cloudwatch logs

Using CloudWatch API you can view metrics collected from your lambda function as a time series. This is helpful in detecting any errors or deviation from standard pattern which may indicate a deterioration in performance.

##### _Metric 1: Invocation counts_

Invocation metric measures the number of times a lambda function was executed including success and failure scenarios. This metric can be used to measure lambda usage.

Look for any deviation from standard pattern:

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
  --metric-name  Invocations \
  --start-time  "2022-02-01T00:00:00" \
  --end-time "2022-02-06T23:59:59" \
  --period  86400 \
  --namespace "AWS/Lambda" \
  --statistics  Sum \
  --dimensions Name=FunctionName,Value=shade_generator

output >>>
{
    "Label": "Invocations",
    "Datapoints": [
        {
            "Timestamp": "2022-02-03T00:00:00+00:00",
            "Sum": 1445.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-06T00:00:00+00:00",
            "Sum": 1392.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-01T00:00:00+00:00",
            "Sum": 1440.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-04T00:00:00+00:00",
            "Sum": 1440.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-02T00:00:00+00:00",
            "Sum": 1441.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-05T00:00:00+00:00",
            "Sum": 1440.0,
            "Unit": "Count"
        }
    ]
}
```

##### _Metric 2: Duration_

This metric measures the time it takes to execute a lambda function and return the response.

Look for any deviation from the standard pattern which may indicate degradation in performance.

```
# Get hourly average execution duration
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
  --metric-name Duration \
  --start-time  "2022-02-06T00:00:00" \
  --end-time "2022-02-06T23:59:59" \
  --period <seconds> \
  --namespace "AWS/Lambda" \
  --statistics Average --dimensions Name=FunctionName,Value=<function name>
```

e.g.;

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
  --metric-name Duration \
  --start-time  "2022-02-06T00:00:00" \
  --end-time "2022-02-06T23:59:59" \
  --period 3600 \
  --namespace "AWS/Lambda" \
  --statistics Average \
  --dimensions Name=FunctionName,Value=shade_generator

output >>>
{
    "Label": "Duration",
    "Datapoints": [
        {
            "Timestamp": "2022-02-06T04:00:00+00:00",
            "Average": 0.9041666666666668,
            "Unit": "Milliseconds"
        },
        {
            "Timestamp": "2022-02-06T17:00:00+00:00",
            "Average": 0.8635,
            "Unit": "Milliseconds"
        },
        {
            "Timestamp": "2022-02-06T22:00:00+00:00",
            "Average": 0.9785483870967743,
            "Unit": "Milliseconds"
        }
```

##### _Metric 3: Error counts_

This metric indicates the number of lambda executions that resulted in an error.

Investigate any increase in error rates using lambda logs.

```
# Get Error counts
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
  --metric-name Errors \
  --start-time  "2022-02-06T00:00:00" \
  --end-time "2022-02-06T23:59:59" \
  --period <seconds> \
  --namespace "AWS/Lambda" \
  --statistics Sum \
  --dimensions Name=FunctionName,Value=<function name>
```

e.g.;

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
  --metric-name Duration \
  --start-time  "2022-02-06T00:00:00" \
  --end-time "2022-02-06T23:59:59" \
  --period 3600 \
  --namespace "AWS/Lambda" \
  --statistics Sum \
  --dimensions Name=FunctionName,Value=shade_generator

output >>>
{
    "Label": "Errors",
    "Datapoints": [
        {
            "Timestamp": "2022-02-06T07:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-06T17:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-06T12:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        }]
}
```

##### _Metric 4: Throttles_

This metric measures the number of invocations that were throttled because they exceeded concurrency limits. You may need to increase concurrency limits if they are being hit frequently.

```
# Check if function is being throttled
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
  --metric-name Throttles \
  --start-time  "2022-02-06T00:00:00" \
  --end-time "2022-02-06T23:59:59" \
  --period <seconds> \
  --namespace "AWS/Lambda" \
  --statistics Sum \
  --dimensions Name=FunctionName,Value=<function name>
```

e.g.;

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
  --metric-name Throttles \
  --start-time  "2022-02-06T00:00:00" \
  --end-time "2022-02-06T23:59:59" \
  --period 3600 \
  --namespace "AWS/Lambda" \
  --statistics Sum \
  --dimensions Name=FunctionName,Value=shade_generator

output >>>
{
    "Label": "Throttles",
    "Datapoints": [
        {
            "Timestamp": "2022-02-06T07:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-06T17:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-06T12:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        }
```

### Checking if EC2 Is Down

#### Status Checks

Status checks indicate if your EC2 instance is running and reachable. There are three important states:
1. InstanceState: ok if instance is up
2. InstanceStatus: ok if instance is reachable on network interface
3. SystemStatus: ok if the VM host server is running and reachable

This command prints out each of these metrics:

```
# Use aws cli to check if the instance is running and reachable.
aws --profile <profile> ec2 describe-instance-status \
--instance-ids <instance_id>
```

e.g;

```
aws --profile taloflow-us-east-1 ec2 describe-instance-status \
--instance-ids i-04adc03eb26023f89
output >>>
{
    "InstanceStatuses": [
        {
            "AvailabilityZone": "us-east-1d",
            "InstanceId": "i-04adc03eb26023f89",
            "InstanceState": {
                "Code": 16,
                "Name": "running"
            },
            "InstanceStatus": {
                "Details": [
                    {
                        "Name": "reachability",
                        "Status": "passed"
                    }
                ],
                "Status": "ok"
            },
            "SystemStatus": {
                "Details": [
                    {
                        "Name": "reachability",
                        "Status": "passed"
                    }
                ],
                "Status": "ok"
            }
        }
    ]
}
```

#### Metric: CPU Utilization

You can check your CPU Utilization to ensure that your CPU isn't being overloaded or having other issues.

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
--metric-name CPUUtilization --start-time 2022-02-01T00:00:00 \
--end-time 2022-02-06T23:59:59 \
--period <seconds> \
--namespace 'AWS/EC2' \
--statistics Average \
--dimensions 'Name=InstanceId,Value=<instance id>'
```
e.g.;

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
--metric-name CPUUtilization --start-time 2022-02-06T22:00:00 \
--end-time 2022-02-06T23:59:59 \
--period 300 \
--namespace 'AWS/EC2' \
--statistics Average \
--dimensions 'Name=InstanceId,Value=i-04adc03eb26023f89'

output >>>
{
    "Label": "CPUUtilization",
    "Datapoints": [
        {
            "Timestamp": "2022-02-06T22:30:00+00:00",
            "Average": 0.1383333333333333,
            "Unit": "Percent"
        },
        {
            "Timestamp": "2022-02-06T23:05:00+00:00",
            "Average": 0.13166666666666665,
            "Unit": "Percent"
        },
        {
            "Timestamp": "2022-02-06T23:40:00+00:00",
            "Average": 0.1233333333333333,
            "Unit": "Percent"
        },
```

#### Metric: StatusCheckFailed_Instance

View instance failures over a period of time with this command:

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
--metric-name StatusCheckFailed_Instance \
--start-time 2022-02-01T00:00:00 \
--end-time 2022-02-06T23:59:59 \
--period <seconds> \
--namespace 'AWS/EC2' \
--statistics Sum \
--dimensions 'Name=InstanceId,Value=<instance id>'
```
e.g.;

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
--metric-name StatusCheckFailed_Instance \
--start-time 2022-02-01T22:00:00 \
--end-time 2022-02-06T23:59:59 \
--period 300 \
--namespace 'AWS/EC2' \
--statistics Sum \
--dimensions 'Name=InstanceId,Value=i-04adc03eb26023f89'

output >>>
{
    "Label": "StatusCheckFailed_Instance",
    "Datapoints": [
        {
            "Timestamp": "2022-02-06T07:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-06T17:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-06T12:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
```

#### Metric: StatusCheckFailed_System

View system failures over a period of time. These are failures of the host server where the VM runs.

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
--metric-name StatusCheckFailed_System \
--start-time 2022-02-01T00:00:00 \
--end-time 2022-02-06T23:59:59 \
--period <seconds> \
--namespace 'AWS/EC2' \
--statistics Sum \
--dimensions 'Name=InstanceId,Value=<instance id>'
```
e.g.;

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
--metric-name StatusCheckFailed_System \
--start-time 2022-02-01T22:00:00 \
--end-time 2022-02-06T23:59:59 \
--period 300 \
--namespace 'AWS/EC2' \
--statistics Sum \
--dimensions 'Name=InstanceId,Value=i-04adc03eb26023f89'

output >>>
{
    "Label": "StatusCheckFailed_System",
    "Datapoints": [
        {
            "Timestamp": "2022-02-06T07:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-06T17:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-06T12:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
```

#### Metric: StatusCheckFailed

View network reachability issues over a period of time with this command:

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
--metric-name StatusCheckFailed \
--start-time 2022-02-01T00:00:00 \
--end-time 2022-02-06T23:59:59 \
--period <seconds> \
--namespace 'AWS/EC2' \
--statistics Sum \
--dimensions 'Name=InstanceId,Value=<instance id>'
```

e.g.;

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
--metric-name StatusCheckFailed \
--start-time 2022-02-01T22:00:00 \
--end-time 2022-02-06T23:59:59 \
--period 300 \
--namespace 'AWS/EC2' \
--statistics Sum \
--dimensions 'Name=InstanceId,Value=i-04adc03eb26023f89'

output >>>
{
    "Label": "StatusCheckFailed",
    "Datapoints": [
        {
            "Timestamp": "2022-02-06T07:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-06T17:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
        {
            "Timestamp": "2022-02-06T12:00:00+00:00",
            "Sum": 0.0,
            "Unit": "Count"
        },
```

### Check if S3 Is Down

#### Use the CLI To List Objects

```
aws --profile <profile> s3 ls <bucket name>
```

e.g.;

```
aws --profile taloflow-us-east-1 s3 ls taloflow-aws-health-check

output >>>
2021-12-27 14:37:17      78874 if-i-get-requested-s3-is-up.jpg
```

#### HTTP GET an object you have access to

```
curl --output <output filename> <s3 object url>
```
e.g.;

```
curl --output ajoy.jpg https://taloflow-aws-health-check.s3.amazonaws.com/if-i-get-requested-s3-is-up.jpg
```

#### Check your cloudwatch metrics

With Amazon CloudWatch request metrics for Amazon S3, you can receive 1-minute CloudWatch metrics. These metrics let you quickly identify and act on operational issues. Request metrics are premium paid for  metrics.

You can enable request metrics for all objects in your bucket using aws cli

```
aws s3api put-bucket-metrics-configuration --endpoint https://s3.us-west-2.amazonaws.com --bucket bucket-name --id metrics-config-id --metrics-configuration '{"Id":"metrics-config-id"}'
```

e.g.;

```
aws s3api put-bucket-metrics-configuration --endpoint https://s3.us-east-1.amazonaws.com --bucket taloflow-aws-health-check --id metrics-config-id --metrics-configuration '{"Id":"all-request-metrics"}'
```

Here's how you list existing metric configurations:

```
aws --profile <profile name> s3api list-bucket-metrics-configurations --bucket <bucket name>
```

```
aws --profile taloflow-us-east-1 s3api list-bucket-metrics-configurations --bucket taloflow-aws-health-check
```

### How To Tell if SQS Is Down

Checking Cloudwatch metrics is your best option for monitoring your SQS service. The key metrics to look at are:

- ApproximateNumberOfMessagesVisible
- ApproximateAgeOfOldestMessage
- NumberOfMessagesDeleted

#### Checking ApproximateNumberOfMessagesVisible

This measures the current depth or backlog of queue. A growing trend in depth indicates an issue with consumers or a need to scale up consumers.

```
aws --profile <profile name> cloudwatch get-metric-statistics \
--metric-name ApproximateNumberOfMessagesVisible \
--start-time <ISO 8601 date> \
--end-time <ISO 8601 date> \
--period <seconds> \
--namespace 'AWS/SQS' \
--statistics Sum \
--dimensions 'Name=QueueName,Value=<queue name>'
```

e.g.

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics --metric-name ApproximateNumberOfMessagesVisible --start-time 2022-02-05T22:00:00 --end-time 2022-02-06T23:59:59 --period 3600 --namespace 'AWS/SQS' --statistics Sum --dimensions 'Name=QueueName,Value=dramatiq_sqs_voting_game_votes'

output >>>
{"Label": "ApproximateNumberOfMessagesVisible","Datapoints": [{"Timestamp": "2022-02-06T07:00:00+00:00","Sum": 0.0,"Unit": "Count"},{"Timestamp": "2022-02-06T17:00:00+00:00","Sum": 0.0,"Unit": "Count"},{"Timestamp": "2022-02-06T12:00:00+00:00","Sum": 0.0,"Unit": "Count"},

```

#### Checking ApproximateAgeOfOldestMessage

If the oldest message in your queue is far too old, this may point to an issue.

```
aws --profile <profile name> cloudwatch get-metric-statistics \
--metric-name ApproximateAgeOfOldestMessage \
--start-time <ISO 8601 date> \
--end-time <ISO 8601 date> \
--period <seconds> \
--namespace 'AWS/SQS' \
--statistics Sum \
--dimensions 'Name=QueueName,Value=<queue name>'
```

e.g.;

```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
--metric-name ApproximateAgeOfOldestMessage \
--start-time 2022-02-05T22:00:00 \
--end-time 2022-02-06T23:59:59 \
--period 3600 \
--namespace 'AWS/SQS' \
--statistics Sum \
--dimensions 'Name=QueueName,Value=dramatiq_sqs_voting_game_votes'
output >>>
{"Label": "ApproximateAgeOfOldestMessage","Datapoints": [{"Timestamp": "2022-02-06T00:00:00+00:00","Sum": 0.0,"Unit": "Seconds"},{"Timestamp": "2022-02-06T23:00:00+00:00","Sum": 0.0,"Unit": "Seconds"},{"Timestamp": "2022-02-06T10:00:00+00:00","Sum": 0.0,"Unit": "Seconds"},
```

#### Checking NumberOfMessagesDeleted

This shows the number of messages that were successfully processed and removed from the queue over a period. This is a measure of your queue consumers throughput.

```
aws --profile <profile name> cloudwatch get-metric-statistics \
--metric-name NumberOfMessagesDeleted \
--start-time <ISO 8601 date> \
--end-time <ISO 8601 date> \
--period <seconds> \
--namespace 'AWS/SQS' \
--statistics Sum \
--dimensions 'Name=QueueName,Value=<queue name>'     
```
e.g.;
```
aws --profile taloflow-us-east-1 cloudwatch get-metric-statistics \
--metric-name NumberOfMessagesDeleted \
--start-time 2022-02-05T22:00:00 \
--end-time 2022-02-06T23:59:59 \
--period 3600 \
--namespace 'AWS/SQS' \
--statistics Sum \
--dimensions 'Name=QueueName,Value=dramatiq_sqs_voting_game_votes'

output >>>

{"Label": "NumberOfMessagesDeleted","Datapoints": [{"Timestamp": "2022-02-06T07:00:00+00:00","Sum": 60.0,"Unit": "Count"},{"Timestamp": "2022-02-06T17:00:00+00:00","Sum": 60.0,"Unit": "Count"},{"Timestamp": "2022-02-06T12:00:00+00:00","Sum": 60.0,"Unit": "Count"},
```

[comment]: <> (### Check if DynamoDB is down )

[comment]: <> (There are three key Cloudwatch metrics to check to assess the health of DynamoDB)

[comment]: <> (1. SuccesfulRequestLatency)

[comment]: <> (2. ReadThrottleEvents)

[comment]: <> (3. WriteThrottleEvents)