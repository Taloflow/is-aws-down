import { StandardCard } from "../blocks/containers/standardCard";
import { LargeParagraphText } from "../blocks/text/largeParagraphText";
import { Spinner } from "../blocks/spinner";

export const DefaultLoading = () => {
  return (
    <StandardCard>
      <div className={"flex justify-center items-center"}>
        <LargeParagraphText className={"max-w-[fit-content]"}>
          Loading...{" "}
        </LargeParagraphText>
        <div className={"h-8 w-8  ml-4 flex"}>
          <Spinner />
        </div>
      </div>
    </StandardCard>
  );
};
