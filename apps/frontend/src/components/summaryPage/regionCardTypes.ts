export interface PageSummary {
  summary: { [key: string]: Summary }[];
  series: Series;
}

export interface Series {
  "API Gateway": APIGateway[];
  DynamoDB: APIGateway[];
  EC2: APIGateway[];
  IAM: APIGateway[];
  Lambda: APIGateway[];
  S3: APIGateway[];
  SQS: APIGateway[];
}

export interface APIGateway {
  timestamp: Date;
  region: string;
  up: number;
  down: number;
}

export interface Summary {
  up: number;
  down: number;
}
