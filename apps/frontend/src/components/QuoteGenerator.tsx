import { StandardCard } from "./blocks/containers/standardCard";
import { LargeParagraphText } from "./blocks/text/largeParagraphText";
import { RefreshButton } from "./blocks/buttons/refreshButton";
import { useEffect } from "react";
import { FailureState } from "./FailureState";
import { Spinner } from "./blocks/spinner";
import { useAtomValue } from "jotai";
import { visibleSectionAtom } from "./RegionPageObserver";
import { useQuoteGeneratorQuery } from "./QuoteGenerator/useQuoteGeneratorQuery";

type QuoteGeneratorProps = {
  regionURL: string;
  apiURL: string;
  sectionId: string;
};

export const QuoteGenerator = ({ regionURL, apiURL, sectionId }: QuoteGeneratorProps) => {
  const visibleSection = useAtomValue(visibleSectionAtom)

  const { data, refetch, status, isLoading } = useQuoteGeneratorQuery({
    apiURL,
    regionURL,
    sectionId,
  })

  // To make sure this get the quote only on first run, we check that the quote is empty
  useEffect(() => {
    if ((data === "" || !data) && sectionId === visibleSection) {
      refetch()
    }
  }, [visibleSection, sectionId, data, refetch]);

  if (status === 'error') {
    return (
      <>
        <FailureState>
          <LargeParagraphText>
            <span className={"text-danger text-center block"}>
              {" "}
              The EC2 Quote Generator has failed. EC2 might be having issues.
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
        </FailureState>
      </>
    );
  }
  
  return (
    <div className={"relative"}>
      <StandardCard>
        <div className={"absolute right-6"}>
          <svg
            width="52"
            height="52"
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.1">
              <path
                d="M21.6298 6.5V22.5138C21.6298 34.8725 13.546 43.2488 2.16667 45.5L0.0108333 40.8395C5.28017 38.8527 8.66667 32.9572 8.66667 28.1667H0V6.5H21.6298ZM52 6.5V22.5138C52 34.8725 43.8793 43.251 32.5 45.5L30.342 40.8395C35.6135 38.8527 39 32.9572 39 28.1667H30.3702V6.5H52Z"
                fill="#3A18AF"
              />
            </g>
          </svg>
        </div>
        <div className={"flex flex-col"}>
          {status === 'loading' ? (
            <LargeParagraphText>
              <Spinner />
            </LargeParagraphText>
          ) : (
            <>
              <LargeParagraphText>
                {data} ...
              </LargeParagraphText>
            </>
          )}
          <div className={"mt-4"}>
            <RefreshButton disabled={isLoading} onClick={() => refetch()}>Get Quote</RefreshButton>
          </div>
        </div>
      </StandardCard>
    </div>
  );
};
