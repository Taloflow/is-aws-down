import {
  LocationSummary,
  ServicesAffected,
} from "../../features/summaryPage/summaryAPI";
import Link from "next/link";
import { LargeParagraphText } from "../blocks/text/largeParagraphText";
import { BodyText } from "../blocks/text/bodyText";

type ComponentProps = {
  Summary: LocationSummary;
};

export const RegionCard = (props: ComponentProps) => {
  return (
    <Link href={"/is-aws-down/" + props.Summary.region}>
      <a
        className={`my-8 ${
          props.Summary["24h"].down > 0 ? "bg-[#F9E0E0]" : "bg-white"
        } px-6 py-6 mx-4 rounded-lg shadow-md hover:shadow-xl transition-all h-fit`}
        key={props.Summary.region}
      >
        <span
          className={
            "text-2xl font-medium underline text-center mb-3 block cursor-pointer"
          }
        >
          {props.Summary.region.replaceAll("-", " ")}
        </span>
        <SummaryLine
          Affected1H={props.Summary["1h"]}
          Affected24H={props.Summary["24h"]}
        />
      </a>
    </Link>
  );
};

type summaryComponentProps = {
  Affected1H: ServicesAffected;
  Affected24H: ServicesAffected;
};

const SummaryLine = (props: summaryComponentProps) => {
  // Returns an error if there are any services affected
  const thereIsAnError = (s: ServicesAffected[]): boolean => {
    let thereIsAnError = false;
    s.map((service) => {
      if (service && service.down > 0) {
        thereIsAnError = true;
      }
    });
    return thereIsAnError;
  };

  if (thereIsAnError([props.Affected1H, props.Affected24H])) {
    return (
      <div className={"h-fit"}>
        <LargeParagraphText extraClasses={"text-left"}>
          These services have had errors:
        </LargeParagraphText>
        {props.Affected24H.services_affected.map((hadError) => {
          return (
            <ul
              className={
                "list-disc pl-6 !-mt-0 text-lg sm:text-xl font-medium leading-relaxed"
              }
            >
              <li>{hadError}</li>
            </ul>
          );
        })}
        <BodyText extraClasses={"flex mx-auto mt-2"}>
          <span className={"flex underline mx-auto items-center"}>
            view detailed stats
            <svg
              className={"ml-2"}
              width="10"
              height="14"
              viewBox="0 0 10 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.916992 1.75L2.70024 0L9.66699 7L2.70024 14L0.916992 12.25L6.16699 7L0.916992 1.75Z"
                fill="#414141"
              />
            </svg>
          </span>
        </BodyText>
      </div>
    );
  } else {
    return (
      <>
        <div
          className={
            "bg-[#B2E9B7] text-[#134606] font-medium px-6 rounded-lg max-h-[fit-content] h-fit"
          }
        >
          <LargeParagraphText extraClasses={"text-center"}>
            There are no errors
          </LargeParagraphText>
        </div>
        <BodyText extraClasses={"flex mx-auto mt-2"}>
          <span className={"flex underline mx-auto items-center"}>
            view detailed stats
            <svg
              className={"ml-2"}
              width="10"
              height="14"
              viewBox="0 0 10 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.916992 1.75L2.70024 0L9.66699 7L2.70024 14L0.916992 12.25L6.16699 7L0.916992 1.75Z"
                fill="#414141"
              />
            </svg>
          </span>
        </BodyText>
      </>
    );
  }
};
