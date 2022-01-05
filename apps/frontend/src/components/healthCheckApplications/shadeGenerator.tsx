import { StandardCard } from "../blocks/containers/standardCard";
import { LargeParagraphText } from "../blocks/text/largeParagraphText";
import { RefreshButton } from "../blocks/buttons/refreshButton";
import { TruncatedTextContainer } from "../blocks/containers/truncatedTextContainer";
import { BodyText } from "../blocks/text/bodyText";
import { useEffect, useState } from "react";
import { DefaultOptions } from "../lottie/defaultOptions";
import animationData from "../lottie/simple-fire.json";
import Lottie from "react-lottie";
import { FailureState } from "./failureState";
import { GetStringOrFail } from "../../api/getString";
import { Spinner } from "../blocks/spinner";
import { tryParsePattern } from "next/dist/build/webpack/plugins/jsconfig-paths-plugin";

type ShadeProps = {
  Title: string;
  SubHeadline: string;
  Endpoint: string;
};

export const ShadeGenerator = (props: ShadeProps) => {
  const [hasFailed, setHasFailed] = useState(false);
  const [shade, setShade] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simple async function to get the quote
  const getShade = async () => {
    setIsLoading(true);
    const { success, resp } = await GetStringOrFail(props.Endpoint);
    setIsLoading(false);
    if (!success) {
      setHasFailed(true);
      return;
    }
    setHasFailed(false);
    setShade(resp);
  };

  // To make sure this get the quote only on first run, we check that the quote is empty
  useEffect(() => {
    if (shade === "") {
      getShade();
    }
  }, []);

  if (hasFailed) {
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
            <div className={"mt-4"} onClick={() => getShade()}>
              <RefreshButton Text={"Try Again"} />
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
    <div className={"flex flex-col"}>
      <LargeParagraphText>
        <span className={"font-bold"}>{props.Title}</span>
      </LargeParagraphText>
      <TruncatedTextContainer>
        <BodyText>
          {props.SubHeadline}{" "}
          <a href="https://example.com">Tell us what it is here.</a>
        </BodyText>
      </TruncatedTextContainer>
      <div className={"relative"}>
        <StandardCard>
          <div className={"flex flex-col"}>
            <LargeParagraphText>{shade}</LargeParagraphText>
            <div className={"flex flex-col xl:flex-row"}>
              <div className={"mt-4"} onClick={() => getShade()}>
                <RefreshButton Text={"New Shade"} />
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
    </div>
  );
};
