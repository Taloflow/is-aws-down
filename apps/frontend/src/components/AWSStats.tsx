import Link from "next/link";
import { Spinner } from "~/components/blocks/spinner";
import { LargeParagraphText } from "~/components/blocks/text/largeParagraphText";
import { FailureState } from "~/components/FailureState";
import { RegionCard } from "~/components/RegionCard";
import { useAWSStatusOverview } from "~/hooks/use-aws-status-overview";
import { serviceListNames } from "~/utils/service-list";
import { StandardCard } from "./blocks/containers/standardCard";
import { ServiceList } from "./ServiceList";
import { StatusOverviewCard } from "./StatusOverviewCard";

export const AWSStats = () => {
    const { data, status } = useAWSStatusOverview()
    if (status === 'loading') {
        return (
            <div className={"h-8 mx-auto mt-12 w-8"}>
                <Spinner />
            </div>
        )
    }
    if (status === 'error') {
        return (
            <div className={"max-w-[550px] mx-auto"}>
                <FailureState>
                    <LargeParagraphText className="text-danger text-center block">
                        Error loading this page. This page is served from GCP. There may
                        be an issue.
                    </LargeParagraphText>
                </FailureState>
            </div>
        )
    }
    return (
        <>
            <div className={"container max-w-[900px] mx-auto mt-24"}>
                <StatusOverviewCard data={data} />
            </div>
            <div
                className={
                    "container mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-auto"
                }
            >
                {data.map((datum) => {
                    return <RegionCard key={datum.region} summary={datum} />;
                })}
            </div>
            <div className={"container max-w-[900px] mx-auto"}>
                <StandardCard>
                    <div className={"space-y-6"}>
                        <LargeParagraphText>
                            If you think your services are down, you can head to our{" "}
                            <Link href='/#debug' className="underline">
                                troubleshooting section
                            </Link>
                        </LargeParagraphText>
                        <LargeParagraphText>
                            We&apos;re running several services on AWS and executing health checks
                            every minute across ten regions. Click through to any region to see
                            those services live. We check:
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
            </div>
        </>
    )
}