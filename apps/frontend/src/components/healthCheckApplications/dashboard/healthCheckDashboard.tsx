import { BodyText } from "../../blocks/text/bodyText";
import { SecondaryTitle } from "../../blocks/text/secondaryTitle";
import { Dashboard } from "./dashboard";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectMetricGraph,
  setMetricsBaseURL,
} from "../../../features/metricGraph/metricGraphSlice";
import { useEffect, useState } from "react";
import { useGetAllMetricsQuery } from "../../../features/metricGraph/metricsGraphAPI";
import { StandardCard } from "../../blocks/containers/standardCard";
import { DefaultLoading } from "../../general/defaultLoading";

type DashboardProps = {
  AnalyticsSource: string; // Like GCP or wherever the health check service is hosted
  EndPoint: string; // fully qualified URL where the data is stored
  ShouldPoll: boolean;
  Region: string;
};

export const HealthCheckDashboardContainer = (props: DashboardProps) => {
  const dispatch = useAppDispatch();

  // The names of the errors shown on the dashboard
  const [activeItem, setActiveItem] = useState("");
  // This field allows the user to have zero items selected, without items then being auto selected
  // when the data refreshes.
  const [activeItemSetOnce, setActiveItemSetOnce] = useState(false);

  // Button open or closed state
  const [showFailedChecks, setShowFailedChecks] = useState(false);

  // Redux Config for the base URL for SQS Game - set at page level for visibility of page config
  useEffect(() => {
    dispatch(setMetricsBaseURL(props.EndPoint));
  }, []);

  const { baseURL } = useAppSelector(selectMetricGraph);

  const { data, isLoading, error } = useGetAllMetricsQuery(props.Region, {
    // Wait until the base URL is set
    skip: baseURL === "",
    // Poll every 5s in case there are status changes. It would be better to just
    // push the changes and merge the data in local state, but that's a future optimization
    pollingInterval: props.ShouldPoll && 5000,
  });

  // on first load, seed this state with the first two items (they are sorted by number of errors)
  useEffect(() => {
    if (activeItem.length === 0 && data && !activeItemSetOnce) {
      setActiveItem("All");
    }
  }, [data]);

  const addOrRemoveLabelFromActiveList = (label: string) => {
    setActiveItemSetOnce(true);
    setActiveItem(label);
  };

  const numberOfHealthChecks = () => {
    if (!data) {
      return -1;
    }
    let count = 0;
    data.map((item) => {
      count = count + item.totalNumberOfChecks;
    });
    return count;
  };

  if (error) {
    return (
      <StandardCard>
        <BodyText extraClasses={"text-danger"}>
          Error fetching dashboard data
        </BodyText>
      </StandardCard>
    );
  }

  if (!data || isLoading) {
    return <DefaultLoading />;
  }

  return (
    <>
      <BodyText>
        <span className={"text-brand-accent font-bold"}>
          This dashboard is displayed using {props.AnalyticsSource}
        </span>
      </BodyText>
      <div className={"pt-4"}>
        <SecondaryTitle>
          Last 24 Hour Stats - {numberOfHealthChecks()} health checks served
        </SecondaryTitle>
        <BodyText extraClasses={"py-2"}>
          Each service receives a check at least once a minute. Each service
          gets 10 seconds before they time out.
        </BodyText>
      </div>
      <StandardCard>
        <div className={"mb-6 flex flex-wrap "}>
          {data.map((item, index) => {
            return (
              <div className={"mr-2 mb-4"} key={item.label}>
                <button
                  onClick={() => addOrRemoveLabelFromActiveList(item.label)}
                  style={{
                    backgroundColor: activeItem.includes(item.label)
                      ? item.uniqueColor
                      : "",
                    color: activeItem.includes(item.label) ? "white" : "",
                    borderColor: item.borderColor,
                    fontStyle: "500",
                    borderWidth: "2px",
                  }}
                  className={"px-4 py-2 text-sm  rounded-lg font-medium"}
                >
                  {item.label} • {item.numberOfOutagesSummary}
                </button>
              </div>
            );
          })}
        </div>
        <Dashboard data={data.filter((datum) => activeItem === datum.label)} />
        <button
          className={
            "text-brand-accent items-center font-bold mt-8 text-lg px-4 py-2 rounded-lg hover:bg-brand-accent hover:bg-opacity-20 transition-colors flex"
          }
          onClick={() => setShowFailedChecks(!showFailedChecks)}
        >
          {showFailedChecks ? "Hide failed checks" : "List failed checks times"}
          <svg
            className={`ml-2  ${showFailedChecks && "rotate-180"}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_641_1840)">
              <path
                d="M8.33555e-07 5.41469L2.66667 2.66669L8 8.00002L13.3333 2.66669L16 5.41469L8 13.3334L8.33555e-07 5.41469Z"
                fill="#3A18AF"
              />
            </g>
            <defs>
              <clipPath id="clip0_641_1840">
                <rect
                  width="16"
                  height="16"
                  fill="white"
                  transform="translate(16) rotate(90)"
                />
              </clipPath>
            </defs>
          </svg>
        </button>
        <div className={"mt-2"}>
          {showFailedChecks &&
            data
              .filter((item) => item.timeStampsOfFailures?.length > 0)
              .map((healthCheck) => {
                return (
                  <div key={healthCheck.label}>
                    <BodyText extraClasses={"font-bold mb-2"}>
                      {healthCheck.label}
                    </BodyText>
                    <div>
                      {healthCheck.timeStampsOfFailures.map((timeStamp) => {
                        return <BodyText key={timeStamp}>{timeStamp}</BodyText>;
                      })}
                    </div>
                  </div>
                );
              })}
        </div>
      </StandardCard>
    </>
  );
};
