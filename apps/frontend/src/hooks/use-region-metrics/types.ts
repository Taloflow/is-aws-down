
export type RegionMetrics = {
    summary: ServiceSummary[];
    series: ServiceSeries;
}

export type RegionService = Readonly<"DynamoDB" | "API Gateway" | "EC2" | "S3" | "SQS" | "Lambda">

type ServiceStats = {
    up: number;
    down: number;
}

type ServiceSummary = Record<RegionService, ServiceStats> & {
    all: ServiceStats;
}
type ServiceSeries = Record<RegionService, ServiceSeriesDatum[]>

type ServiceSeriesDatum = {
    timestamp: string;
    region: string;
    up: number;
    down: number;
}