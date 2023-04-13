import { Spinner } from "~/components/blocks/spinner";
import { LargeParagraphText } from "~/components/blocks/text/largeParagraphText";
import { FailureState } from "~/components/healthCheckApplications/failureState";
import { RegionCard } from "~/components/summaryPage/regionCard";
import { useAWSStatusOverview } from "~/hooks/use-aws-status-overview";
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
        </>
    )
}