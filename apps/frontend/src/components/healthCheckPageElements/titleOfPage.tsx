import { MainTitle } from "../blocks/text/mainTitle";
import { LargeParagraphText } from "../blocks/text/largeParagraphText";

type TitleOfPageProps = {
  RegionName: string; // Passed through like us-east-1
};

export const TitleOfPage = (props: TitleOfPageProps) => {
  return (
    <div className={"main-column mx-auto pt-12"}>
      <div className={"px-0 xl:px-36"}>
        <MainTitle>
          <span className={"text-center block pb-10"}>
            Is {props.RegionName.toUpperCase()} Down?
          </span>
        </MainTitle>
        <div className={"space-y-6"}>
          <LargeParagraphText>
            We’re running several small applications on{" "}
            <span className={"font-mono bg-neutral-text text-white px-2"}>
              {props.RegionName}
            </span>{" "}
            servers and checking their uptime.
          </LargeParagraphText>
          <LargeParagraphText>
            Due to how AWS sets up their availability zones, we may experience
            issues that you do not, or vice versa.
          </LargeParagraphText>
          <LargeParagraphText>
            Built by the engineers at Taloflow. If you’re looking for an S3
            alternative and tired of digging through vendor sales pages, try our{" "}
            <a
              className={"text-brand"}
              href={"https://app.taloflow.ai"}
              target={"_blank"}
            >
              object storage recommendation tool
            </a>
            .
          </LargeParagraphText>
        </div>
      </div>
    </div>
  );
};
