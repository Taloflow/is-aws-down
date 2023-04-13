import { ServiceListItem } from "~/components/ServiceList"

export const serviceList: Readonly<ServiceListItem[]> = [
  { name: 'IAM', url: '#stats' },
  { name: 'SQS', url: '#is-sqs-down' },
  { name: 'S3', url: '#is-s3-down' },
  { name: 'EC2', url: '#is-ec2-down' },
  { name: 'Lambda', url: '#is-lambda-down'},
  { name: 'DynamoDB', url: '#is-dynamodb-down' },
  { name: 'API Gateway', url: '#is-api-gateway-down' }
]

export const serviceListNames = serviceList.map(service => ({ name: service.name }) as const)