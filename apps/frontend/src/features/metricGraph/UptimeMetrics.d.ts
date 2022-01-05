export interface MetricsData {
  summary: Summary[];
  series: Series;
}

export interface Summary {
  all: All;
  DynamoDB: DynamoDb;
  "API Gateway": ApiGateway;
  EC2: Ec2;
  S3: S3;
  SQS: Sqs;
  Lambda: Lambda;
}

export interface All {
  up: number;
  down: number;
}

export interface DynamoDb {
  up: number;
  down: number;
}

export interface ApiGateway {
  up: number;
  down: number;
}

export interface Ec2 {
  up: number;
  down: number;
}

export interface S3 {
  up: number;
  down: number;
}

export interface Sqs {
  up: number;
  down: number;
}

export interface Lambda {
  up: number;
  down: number;
}

export interface Series {
  DynamoDB: DynamoDb2[];
  "API Gateway": ApiGateway2[];
  EC2: Ec22[];
  S3: S32[];
  SQS: Sqs2[];
  Lambda: Lambda2[];
}

export interface DynamoDb2 {
  timestamp: string;
  region: string;
  up: number;
  down: number;
}

export interface ApiGateway2 {
  timestamp: string;
  region: string;
  up: number;
  down: number;
}

export interface Ec22 {
  timestamp: string;
  region: string;
  up: number;
  down: number;
}

export interface S32 {
  timestamp: string;
  region: string;
  up: number;
  down: number;
}

export interface Sqs2 {
  timestamp: string;
  region: string;
  up: number;
  down: number;
}

export interface Lambda2 {
  timestamp: string;
  region: string;
  up: number;
  down: number;
}
