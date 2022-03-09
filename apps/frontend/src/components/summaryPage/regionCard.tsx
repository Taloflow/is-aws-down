import {
  LocationSummary,
  ServicesAffected,
} from "../../features/summaryPage/summaryAPI";
import Link from "next/link";
import { LargeParagraphText } from "../blocks/text/largeParagraphText";

type ComponentProps = {
  Summary: LocationSummary;
};

export const RegionCard = (props: ComponentProps) => {
  return (
    <Link href={"/is-aws-down/" + props.Summary.region}>
      <a
        className={`my-8 ${
          props.Summary["24h"].down > 0 ? "bg-[#F9E0E0]" : "bg-white"
        } px-6 py-6 mx-4 rounded-lg shadow-md hover:shadow-xl transition-all`}
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
      <div>
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
      </div>
    );
  } else {
    return (
      <div
        className={"bg-[#B2E9B7] text-[#134606] font-medium px-6 rounded-lg"}
      >
        <LargeParagraphText extraClasses={"text-center"}>
          There are no errors
        </LargeParagraphText>
      </div>
    );
  }
};
