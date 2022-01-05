import { StandardCard } from "../blocks/containers/standardCard";
import { LargeParagraphText } from "../blocks/text/largeParagraphText";
import { RefreshButton } from "../blocks/buttons/refreshButton";
import { TruncatedTextContainer } from "../blocks/containers/truncatedTextContainer";
import { BodyText } from "../blocks/text/bodyText";
import { useEffect, useState } from "react";
import { FailureState } from "./failureState";
import { GetStringOrFail } from "../../api/getString";
import { Spinner } from "../blocks/spinner";

type QuoteProps = {
  Title: string;
  SubHeadline: string;
  Endpoint: string;
};

export const QuoteGenerator = (props: QuoteProps) => {
  const [hasFailed, setHasFailed] = useState(false);
  const [quote, setQuote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simple async function to get the quote
  const getQuote = async () => {
    setIsLoading(true);
    const { success, resp } = await GetStringOrFail(props.Endpoint);
    setIsLoading(false);
    if (!success) {
      setHasFailed(true);
      return;
    }
    setHasFailed(false);
    setQuote(resp);
  };

  // To make sure this get the quote only on first run, we check that the quote is empty
  useEffect(() => {
    if (quote === "") {
      getQuote();
    }
  }, []);

  if (hasFailed) {
    return (
      <FailureState>
        <LargeParagraphText>
          <span className={"text-danger text-center block"}>
            {" "}
            The EC2 Quote Generator has failed. EC2 might be having issues.
          </span>
        </LargeParagraphText>
        <div className={"flex w-full justify-center items-center mt-4"}>
          <div className={"mt-4"} onClick={() => getQuote()}>
            <RefreshButton Text={"Try Again"} />
            {isLoading && (
              <div className={"absolute bottom-4 right-4 h-8 w-8"}>
                <Spinner />
              </div>
            )}
          </div>
        </div>
        {isLoading && (
          <div className={"absolute bottom-4 right-4 h-8 w-8"}>
            <Spinner />
          </div>
        )}
      </FailureState>
    );
  }
  return (
    <div className={"flex flex-col relative"}>
      <LargeParagraphText>
        <span className={"font-bold"}>{props.Title}</span>
      </LargeParagraphText>
      <TruncatedTextContainer>
        <BodyText>{props.SubHeadline}</BodyText>
      </TruncatedTextContainer>
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
            <LargeParagraphText>{quote}...</LargeParagraphText>
            <div onClick={() => getQuote()} className={"mt-4"}>
              <RefreshButton Text={"New Quote"} />
            </div>
            {isLoading && (
              <div className={"absolute bottom-4 right-4 h-8 w-8"}>
                <Spinner />
              </div>
            )}
          </div>
        </StandardCard>
      </div>
    </div>
  );
};
