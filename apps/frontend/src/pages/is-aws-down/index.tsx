import { useGetStatsQuery } from "../../features/summaryPage/summaryAPI";
import { useEffect } from "react";
import { Spinner } from "../../components/blocks/spinner";
import Link from "next/link";

export default function IsAwsDown() {
  const { data, isLoading, error } = useGetStatsQuery("");
  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (error) {
      console.warn(error);
    }
  }, [data, error]);

  if (isLoading) {
    return (
      <div>
        <div className={"h-8 mx-auto mt-12 w-8"}>
          <Spinner />
        </div>
      </div>
    );
  }
  if (error) {
  }
  return (
    <div>
      {data.map((datum) => {
        return (
          <div key={datum.region}>
            <div>{datum.region}</div>
            <Link href={"/is-aws-down/" + datum.region}>Go To This Page</Link>
          </div>
        );
      })}
    </div>
  );
}
