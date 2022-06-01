import { MainTitle } from "../blocks/text/mainTitle";
import { LargeParagraphText } from "../blocks/text/largeParagraphText";
import { StandardCard } from "../blocks/containers/standardCard";
import { BodyText } from "../blocks/text/bodyText";
import { useEffect, useState } from "react";
import { useGetAllMetricsQuery } from "../../features/metricGraph/metricsGraphAPI";
import { useAppSelector } from "../../app/hooks";
import { selectMetricGraph } from "../../features/metricGraph/metricGraphSlice";
import { DefaultLoading } from "../general/defaultLoading";
import { LocationSummary } from "../../features/summaryPage/summaryAPI";
import { DataForChartJS } from "../../features/metricGraph/transformForChartJS";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/react";
import { SerializedError } from "@reduxjs/toolkit";

type TitleOfPageProps = {
  RegionName: string; // Passed through like us-east-1
  ShouldPoll: boolean;
  SummaryData?: LocationSummary[];
  SummaryDataFetchError?: FetchBaseQueryError | SerializedError;
  regionNameForEndpoint: string;
  IsSummaryPage?: boolean;
};

type PageState = {
  PageTitle: string;
  iconPath: string;
  HadIssuesInLastHour?: string[];
  HadIssuesInLastDay?: string[];
  RegionsWithIssues?: string[] | undefined;
};

export const AWSIsUpOrDown = (props: TitleOfPageProps) => {
  const [pageState, setPageState] = useState<PageState | null>();

  const { baseURL } = useAppSelector(selectMetricGraph);

  const { data, isLoading, error, refetch } = useGetAllMetricsQuery(
    props.regionNameForEndpoint,
    {
      // Wait until the base URL is set
      skip: baseURL === "",
      // Poll every 5s in case there are status changes. It would be better to just
      // push the changes and merge the data in local state, but that's a future optimization
      pollingInterval: props.ShouldPoll && 5000,
    }
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    let hadIssuesInLastHour = [] as string[];
    let hadIssuesInLastDay = [] as string[];
    data.map((downChecks) => {
      if (downChecks.label === "All") {
        return;
      }
      downChecks.data.map((datum, index) => {
        // Check if the index of the error was in the last 60 checks
        if (index > downChecks.data.length - 60 && datum === -1) {
          hadIssuesInLastHour.push(downChecks.label);
        }
        if (datum === -1) {
          hadIssuesInLastDay.push(downChecks.label);
        }
      });
    });
    hadIssuesInLastHour = [...new Set(hadIssuesInLastHour)];
    hadIssuesInLastDay = [...new Set(hadIssuesInLastDay)];

    hadIssuesInLastHour.sort();
    hadIssuesInLastDay.sort();
    if (hadIssuesInLastHour.length > 0 || hadIssuesInLastDay.length > 0) {
      setPageState({
        PageTitle: `AWS services in ${props.RegionName.toUpperCase()} have had issues in the last ${
          hadIssuesInLastHour.length > 0 ? "hour" : "day"
        }`,
        iconPath: process.env.NEXT_PUBLIC_CDN_HOST + "/icons8-fire.gif",
        HadIssuesInLastHour: hadIssuesInLastHour,
        HadIssuesInLastDay: hadIssuesInLastDay,
      });
    } else {
      setPageState({
        PageTitle: `AWS ${props.RegionName.toUpperCase()} is up!`,
        iconPath: process.env.NEXT_PUBLIC_CDN_HOST + "/icons8-scroll-up.gif",
        HadIssuesInLastHour: hadIssuesInLastHour,
        HadIssuesInLastDay: hadIssuesInLastDay,
      });
    }
  }, [data]);

  // If the info is passed through from the summary page, this is where we
  // handle it
  useEffect(() => {
    if (!props.SummaryData) {
      return;
    }
    let hadIssuesInLastHour = [] as string[];
    let hadIssuesInLastDay = [] as string[];
    let downRegions = [] as string[];
    props.SummaryData.map((summaryDatum) => {
      if (summaryDatum["1h"].down > 0) {
        hadIssuesInLastHour.push(...summaryDatum["1h"].services_affected);
      }
      if (summaryDatum["24h"].down > 0) {
        hadIssuesInLastDay.push(...summaryDatum["24h"].services_affected);
        downRegions.push(summaryDatum.region);
      }
    });
    hadIssuesInLastHour = [...new Set(hadIssuesInLastHour)];
    hadIssuesInLastDay = [...new Set(hadIssuesInLastDay)];
    if (hadIssuesInLastDay.length > 0) {
      setPageState({
        PageTitle: `Some AWS services have had issues in the last day`,
        iconPath: process.env.NEXT_PUBLIC_CDN_HOST + "/icons8-fire.gif",
        HadIssuesInLastHour: hadIssuesInLastHour,
        HadIssuesInLastDay: hadIssuesInLastDay,
        RegionsWithIssues: downRegions,
      });
    } else {
      setPageState({
        PageTitle: `Our health check show AWS is up!`,
        iconPath: process.env.NEXT_PUBLIC_CDN_HOST + "/icons8-scroll-up.gif",
      });
    }
  }, [props.SummaryData]);

  if (props.SummaryDataFetchError) {
    return (
      <StandardCard>
        <BodyText extraClasses={"text-danger font-bold"}>
          Error fetching dashboard data from GCP.
        </BodyText>
      </StandardCard>
    );
  }

  if (error) {
    return (
      <StandardCard>
        <BodyText extraClasses={"text-danger font-bold"}>
          Error fetching dashboard data from GCP. The applications below run on
          AWS {props.RegionName}. You may be able to tell if AWS is up by using
          them.
        </BodyText>
      </StandardCard>
    );
  }

  if (isLoading || !pageState) {
    return <DefaultLoading />;
  }

  if ((!data && !props.SummaryData) || !pageState) {
    return <DefaultLoading />;
  }

  return (
    <>
      <StandardCard>
        <div
          className={
            "shadow-xl -mt-24 bg-white mx-auto flex items-center max-w-[fit-content] rounded-full p-8"
          }
        >
          <img
            loading={"lazy"}
            className={"h-[92px]"}
            src={pageState.iconPath}
            alt={"up arrow icon"}
          />
        </div>
        <div className={"px-0 xl:px-8 mt-12"}>
          <MainTitle>
            <span className={"text-center block pb-4"}>
              {pageState.PageTitle}
            </span>
          </MainTitle>

          {/*Show a dialog box if there have been no errors*/}
          {pageState.HadIssuesInLastHour?.length === 0 &&
            pageState.HadIssuesInLastDay?.length === 0 && (
              <div
                className={
                  "rounded-lg bg-success bg-opacity-40 mx-auto max-w-[fit-content] font-bold mb-8 text-[#134606] px-8 py-2 text-2xl"
                }
              >
                <LargeParagraphText>
                  {" "}
                  Our health checks returned no errors in the last day
                </LargeParagraphText>
              </div>
            )}
          {pageState.RegionsWithIssues?.length > 0 && (
            <>
              <LargeParagraphText extraClasses={"mt-4"}>
                These regions have had failures in the last day:
              </LargeParagraphText>
              <ul
                className={
                  "list-disc pl-6 !-mt-0 text-lg sm:text-xl font-medium leading-relaxed"
                }
              >
                {pageState.RegionsWithIssues.map((item) => {
                  return <li key={item}>{item}</li>;
                })}
              </ul>
            </>
          )}
          {pageState.HadIssuesInLastHour?.length > 0 && (
            <>
              <LargeParagraphText extraClasses={"mt-4"}>
                These services have had failures in the last hour:
              </LargeParagraphText>
              <ul
                className={
                  "list-disc pl-6 !-mt-0 text-lg sm:text-xl font-medium leading-relaxed"
                }
              >
                {pageState.HadIssuesInLastHour.map((item) => {
                  return <li key={item}>{item}</li>;
                })}
              </ul>
            </>
          )}
          {pageState.HadIssuesInLastDay?.length > 0 && (
            <>
              <LargeParagraphText extraClasses={"mt-4"}>
                These services have had failures in the last day:
              </LargeParagraphText>
              <ul
                className={
                  "list-disc pl-6 !-mt-0 text-xl font-medium leading-relaxed"
                }
              >
                {pageState.HadIssuesInLastDay.map((item) => {
                  return <li key={item}>{item}</li>;
                })}
              </ul>
            </>
          )}
          {pageState.HadIssuesInLastHour?.length === 0 &&
            pageState.HadIssuesInLastDay?.length === 0 && (
              <Description RegionName={props.RegionName} />
            )}
        </div>
      </StandardCard>
      {pageState.HadIssuesInLastDay?.length > 0 && (
        <StandardCard>
          <Description RegionName={props.RegionName} />
        </StandardCard>
      )}
    </>
  );
};

type DescriptionProps = {
  RegionName: string;
};

const Description = (props: DescriptionProps) => {
  return (
    <div className={"space-y-6"}>
      <LargeParagraphText>
        If you think your services are down, you can head to our{" "}
        <a className={"underline"} href={"/is-aws-down#debug"}>
          troubleshooting section
        </a>
      </LargeParagraphText>
      {props.RegionName === "" ? (
        <LargeParagraphText>
          We’re running several services on AWS and executing health checks
          every minute across ten regions. Click through to any region to see
          those services live. We check:
        </LargeParagraphText>
      ) : (
        <LargeParagraphText>
          We’re running several small applications on{" "}
          <span className={"font-mono bg-neutral-text text-white px-2"}>
            {props.RegionName}
          </span>{" "}
          servers and checking uptime for
        </LargeParagraphText>
      )}

      <ul
        className={
          "list-disc pl-6 !-mt-0 text-lg sm:text-xl font-medium leading-relaxed"
        }
      >
        <li>
          {props.RegionName === "" ? <p>IAM</p> : <a href={"#stats"}>IAM</a>}
        </li>
        <li>
          {props.RegionName === "" ? (
            <p>SQS</p>
          ) : (
            <a href={"#is-sqs-down"}>SQS</a>
          )}
        </li>
        <li>
          {props.RegionName === "" ? <p>S3</p> : <a href={"#is-s3-down"}>S3</a>}
        </li>
        <li>
          {props.RegionName === "" ? (
            <p>EC2</p>
          ) : (
            <a href={"#is-ec2-down"}>EC2</a>
          )}
        </li>
        <li>
          {props.RegionName === "" ? (
            <p>Lambda</p>
          ) : (
            <a href={"#is-lambda-down"}>Lambda</a>
          )}
        </li>
        <li>
          {props.RegionName === "" ? (
            <p>DynamoDB</p>
          ) : (
            <a href={"#is-dynamodb-down"}>DynamoDB</a>
          )}
        </li>
        <li>
          {props.RegionName === "" ? (
            <p>API Gateway</p>
          ) : (
            <a href={"#is-api-gateway-down"}>API Gateway</a>
          )}
        </li>
      </ul>
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
  );
};
