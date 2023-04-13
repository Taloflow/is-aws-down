
export type RegionMetrics = {
    summary: ServiceSummary[];
    series: ServiceSeries;
}

type ServiceStats = {
    up: number;
    down: number;
}

type ServiceSummary = {
    all: ServiceStats;
    DynamoDB: ServiceStats;
    "API Gateway": ServiceStats;
    EC2: ServiceStats;
    S3: ServiceStats;
    SQS: ServiceStats;
    Lambda: ServiceStats;
}

type ServiceSeries = {
    DynamoDB: ServiceSeriesDatum[];
    "API Gateway": ServiceSeriesDatum[];
    EC2: ServiceSeriesDatum[];
    S3: ServiceSeriesDatum[];
    SQS: ServiceSeriesDatum[];
    Lambda: ServiceSeriesDatum[];
}

type ServiceSeriesDatum = {
    timestamp: string;
    region: string;
    up: number;
    down: number;
}