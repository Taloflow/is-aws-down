import { LargeParagraphText } from "./blocks/text/largeParagraphText";
import { ReactNode, useEffect, useRef, useState } from "react";
import { FailureState } from "./FailureState";

type S3ImageProps = {
  src: string;
  alt: string;
  children?: ReactNode
  error?: ReactNode
};

export const S3Image = ({ children, error, ...props }: S3ImageProps) => {
  const [imageFailed, setImageFailed] = useState<boolean>(false);
  const imageContainer = useRef(null);
  const testImage = () => {
    const testImage = new Image();
    testImage.addEventListener("error", function () {
      setImageFailed(true);
    });
    testImage.src = props.src;
    testImage.alt = props.alt;
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
      <FailureState>
        <LargeParagraphText>
          {error}
        </LargeParagraphText>
      </FailureState>
    );
  }
  return (
    <div className={"flex flex-col sm:flex-row justify-center"}>
      <div ref={imageContainer} />
      {children}
    </div>
  );
};
