import {
  useGetStatsQuery,
  ServicesAffected,
  LocationSummary,
} from "../../features/summaryPage/summaryAPI";
import { useEffect, useState } from "react";
import { Spinner } from "../../components/blocks/spinner";
import { FailureState } from "../../components/healthCheckApplications/failureState";
import { LargeParagraphText } from "../../components/blocks/text/largeParagraphText";
import { SEO } from "../../components/seo";
import { RegionCard } from "../../components/summaryPage/regionCard";
import { AWSIsUpOrDown } from "../../components/healthCheckPageElements/awsIsUpOrDown";
import { useAppDispatch } from "../../app/hooks";
import { setBaseURL } from "../../features/votingGame/votingGameSlice";
import { DataForChartJS } from "../../features/metricGraph/transformForChartJS";

export default function IsAwsDown() {
  const { data, isLoading, error } = useGetStatsQuery("");

  if (isLoading) {
    return (
      <div>
        <SEO
          Title={"Is AWS Down? Or Is It Just You? AWS Health Checks"}
          Description={"Debug Steps and Monitoring Of 10 Regions "}
        />
        <div className={"h-8 mx-auto mt-12 w-8"}>
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={"max-w-[550px] mx-auto"}>
        <SEO
          Title={"Is AWS Down? Or Is It Just You? AWS Health Checks"}
          Description={"Debug Steps and Monitoring Of 10 Regions "}
        />
        <FailureState>
          <LargeParagraphText>
            <span className={"text-danger text-center block"}>
              {" "}
              Error loading this page. This page is served from GCP. There may
              be an issue.
            </span>
          </LargeParagraphText>
        </FailureState>
      </div>
    );
  }
  return (
    <div>
      <SEO
        Title={"Is AWS Down? Or Is It Just You? AWS Health Checks"}
        Description={"Debug Steps and Monitoring Of 10 Regions "}
      />
      <div className={"container max-w-[900px] mx-auto mt-24"}>
        <AWSIsUpOrDown
          RegionName={""}
          ShouldPoll={true}
          SummaryData={data}
          SummaryDataFetchError={error}
          regionNameForEndpoint={""}
        />
      </div>
      <div
        className={
          "container mt-12 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-auto"
        }
      >
        {data.map((datum) => {
          return <RegionCard key={datum.region} Summary={datum} />;
        })}
      </div>
    </div>
  );
}
