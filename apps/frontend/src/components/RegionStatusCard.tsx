import Link from "next/link"
import { useMemo } from "react"
import { useRegionMetricsIssues } from "~/hooks/use-region-metrics-issues"
import { RegionChartMetric } from "~/hooks/use-region-metrics/transform"
import { serviceListNames } from "~/util/service-list"
import { StandardCard } from "./blocks/containers/standardCard"
import { LargeParagraphText } from "./blocks/text/largeParagraphText"
import { HealthCheckCard } from "./HealthCheckCard"
import { CheckIssueList } from "./HealthCheckCard/CheckIssueList"
import { InfoBox } from "./InfoBox"
import { ServiceList } from "./ServiceList"

type RegionStatusCardProps = {
    regionName: string;
    data: RegionChartMetric[];
}

export const RegionStatusCard = ({ regionName, data }: RegionStatusCardProps) => {
    const { lastDay, lastHour } = useRegionMetricsIssues(data)
    const status = useMemo(() => lastDay.size > 0 || lastHour.size > 0 ? 'down' : 'up', [lastDay])
    const title = useMemo(() => {
        if (status === 'down') {
            return `AWS services in ${regionName.toUpperCase()} have had issues in the last ${lastHour.size > 0 ? "hour" : "day"}`
        }
        return `AWS ${regionName.toUpperCase()} is up!`
    }, [status])
    const hadIssues = useMemo(() => lastHour.size > 0 || lastDay.size > 0, [lastDay, lastHour])

    return (
        <>
            <HealthCheckCard
                title={title}
                status={status}
            >
                {!hadIssues && (
                    <InfoBox>
                        Our health checks returned no errors in the last day
                    </InfoBox>
                )}
                {lastHour.size > 0 && (
                    <CheckIssueList
                        title='These services have had failures in the last hour:'
                    >
                        {Array.from(lastHour).map(service => <li key={service}>{service}</li>)}
                    </CheckIssueList>
                )}
                {lastDay.size > 0 && (
                    <CheckIssueList
                        title='These services have had failures in the last day:'
                    >
                        {Array.from(lastDay).map(service => <li key={service}>{service}</li>)}
                    </CheckIssueList>
                )}
            </HealthCheckCard>
            <StandardCard>
                <div className={"space-y-6"}>
                    <LargeParagraphText>
                        If you think your services are down, you can head to our{" "}
                        <Link href='/#debug' className="underline">
                            troubleshooting section
                        </Link>
                    </LargeParagraphText>
                    <LargeParagraphText>
                        We&apos;re running several small applications on{" "}
                        <span className={"font-mono bg-neutral-text text-white px-2"}>
                            {regionName}
                        </span>{" "}
                        servers and checking uptime for
                    </LargeParagraphText>
                    <ServiceList services={serviceListNames} />
                    <LargeParagraphText>
                        Our health checks use the AWS API to invoke services directly. If the
                        service does not respond in 30 seconds we mark it as failed.
                    </LargeParagraphText>
                    <LargeParagraphText>
                        Due to how AWS sets up their availability zones, we may experience
                        issues that you do not, or vice versa.
                    </LargeParagraphText>
                    <LargeParagraphText>
                        If you&apos;re looking alternatives to AWS and are tired of digging through vendor sales pages to run good comparisons, <a className={"text-brand"} href="https://use.taloflow.ai/start/" target={"_blank"}>try our tool</a>.
                    </LargeParagraphText>
                </div>
            </StandardCard>
        </>
    )
}