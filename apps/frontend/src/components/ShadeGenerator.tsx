import { StandardCard } from "./blocks/containers/standardCard";
import { LargeParagraphText } from "./blocks/text/largeParagraphText";
import { RefreshButton } from "./blocks/buttons/refreshButton";
import { TruncatedTextContainer } from "./blocks/containers/truncatedTextContainer";
import { BodyText } from "./blocks/text/bodyText";
import { useEffect, useState } from "react";
import { FailureState } from "./FailureState";
import { GetStringOrFail } from "../api/getString";
import { Spinner } from "./blocks/spinner";
import { useShadeGeneratorQuery } from "./ShadeGenerator/useShadeGeneratorQuery";
import { useAtomValue } from "jotai";
import { visibleSectionAtom } from "./RegionPageObserver";

type ShadeGeneratorProps = {
  regionURL: string;
  sectionId: string;
  apiURL: string;
};

export const ShadeGenerator = ({ regionURL, sectionId, apiURL }: ShadeGeneratorProps) => {
  const visibleSection = useAtomValue(visibleSectionAtom)
  const { data, status, isLoading, refetch } = useShadeGeneratorQuery({ regionURL, sectionId, apiURL })

  // To make sure this get the quote only on first run, we check that the quote is empty
  useEffect(() => {
    if ((data === "" || !data) && visibleSection === sectionId) {
      refetch()
    }
  }, [visibleSection, sectionId, data, refetch]);

  if (status === 'error') {
    return (
      <FailureState>
        <div className={"flex flex-col items-center "}>
          <LargeParagraphText>
            <span className={"text-danger text-center block"}>
              {" "}
              The Lambda Shade Generator has failed. Lambda or API gateway might
              be having issues.
            </span>
          </LargeParagraphText>
          <div className={"flex w-full justify-center items-center mt-4"}>
            <div className={"mt-4"}>
              <RefreshButton onClick={() => refetch()} disabled={isLoading}>Try Again</RefreshButton>
              {isLoading && (
                <div className={"absolute bottom-4 right-4 h-8 w-8"}>
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </div>
      </FailureState>
    );
  }
  return (
    <div className={"relative"}>
      <StandardCard>
        <div className={"flex flex-col"}>
          <LargeParagraphText>{data}</LargeParagraphText>
          <div className={"flex flex-col xl:flex-row"}>
            <div className={"mt-4"}>
              <RefreshButton onClick={() => refetch()} disabled={isLoading}>New Shade</RefreshButton>
            </div>
          </div>
        </div>
        {isLoading && (
          <div className={"absolute bottom-4 right-4 h-8 w-8"}>
            <Spinner />
          </div>
        )}
      </StandardCard>
    </div>
  );
};
