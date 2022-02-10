import { useEffect, useState } from "react";
import { PageSummary } from "./regionCardTypes";
import { Spinner } from "../blocks/spinner";

type RegionCardProps = {
  RegionName: string;
};

export const RegionCard = (props: RegionCardProps) => {
  const [data, setData] = useState<undefined | PageSummary>(undefined);
  const [error, setError] = useState<undefined | string>(undefined);
  const getData = async () => {
    if (!props.RegionName) {
      return;
    }
    try {
      const resp = await fetch(
        `https://aws-health-check-api-gmoizr7c4q-uc.a.run.app/metrics?region=${props.RegionName}`
      );
      if (!resp.ok || resp.status !== 200) {
        setError(
          () =>
            `Error fetching data. This is not necessarily a problem with AWS.`
        );
      }
    } catch (e) {
      console.warn(e);
      setError(
        () => `Error fetching data. This is not necessarily a problem with AWS.`
      );
    }
  };
  useEffect(() => {
    getData();
  }, [props.RegionName]);
  if (!data && !error) {
    return (
      <div className={"h-8 w-8"}>
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (
    data &&
    data?.summary &&
    data.summary["all"] &&
    data.summary["all"]["down"] === 0
  ) {
    return <div>No errors</div>;
  }
  return <div>Something went wrong</div>;
};
