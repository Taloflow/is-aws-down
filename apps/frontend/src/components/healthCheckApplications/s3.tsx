import { LargeParagraphText } from "../blocks/text/largeParagraphText";
import { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import { DefaultOptions } from "../lottie/defaultOptions";
import animationData from "../lottie/simple-fire.json";
import { StandardCard } from "../blocks/containers/standardCard";
import { FailureState } from "./failureState";

type S3Props = {
  ServiceName: string; // like S3 or GCS
  Endpoint: string; // URL where the image is
  AltText: string; // Image alt text
  Region: string; // Region like us east 1
};

export const S3 = (props: S3Props) => {
  const [imageFailed, setImageFailed] = useState<boolean>(false);
  const imageContainer = useRef(null);
  const testImage = () => {
    const testImage = new Image();
    testImage.addEventListener("error", function () {
      setImageFailed(true);
    });
    testImage.src = props.Endpoint;
    testImage.alt = props.AltText;
    if (!imageContainer.current) {
      return;
    }
    imageContainer.current.appendChild(testImage);
  };
  useEffect(() => {
    testImage();
  }, []);
  if (imageFailed) {
    return (
      <>
        <LargeParagraphText>
          <span className={"font-bold"}>{props.ServiceName} File Serving</span>
        </LargeParagraphText>
        <FailureState>
          <LargeParagraphText>
            <span className={"text-danger text-center block"}>
              Requesting{" "}
              <a href={props.Endpoint} target={"_blank"}>
                this image
              </a>{" "}
              failed. {props.ServiceName} in {props.Region} might be down
            </span>
          </LargeParagraphText>
        </FailureState>
      </>
    );
  }
  return (
    <>
      <LargeParagraphText>
        <span className={"font-bold"}>{props.ServiceName} File Serving</span>
      </LargeParagraphText>
      <StandardCard>
        <div className={"flex flex-col sm:flex-row justify-center"}>
          {imageFailed ? (
            <>
              <Lottie
                options={DefaultOptions(animationData)}
                height={400}
                width={400}
              />
            </>
          ) : (
            <></>
          )}
          <div ref={imageContainer}>
            <></>
          </div>
          <div className={"mt-4 sm:my-auto sm:ml-6  "}>
            <LargeParagraphText>
              This image is served from {props.ServiceName} in {props.Region}{" "}
              Suggest a new image on our{" "}
              <a href={"https://github.com/Taloflow/is-aws-down/discussions"} target={"_blank"}>
                github community
              </a>
              .
            </LargeParagraphText>
          </div>
        </div>
      </StandardCard>
    </>
  );
};
