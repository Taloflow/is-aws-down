import { StandardCard } from "../blocks/containers/standardCard";
import { LargeParagraphText } from "../blocks/text/largeParagraphText";
import { BodyText } from "../blocks/text/bodyText";
import { useEffect, useState } from "react";

export const HNAlert = () => {
  // Show a special page section for HN Visitors
  const [isHNVisitor, setIsHNVisitor] = useState(false);
  useEffect(() => {
    if (
      document.referrer.includes("news.ycomb") ||
      window.location.href.includes("test-hn")
    ) {
      setIsHNVisitor(true);
    }
  }, []);
  if (!isHNVisitor) {
    return null;
  }

  return (
    <section className={"main-column mx-auto pt-12"}>
      <StandardCard>
        <LargeParagraphText>Hey HN visitor 👋</LargeParagraphText>
        <div className={"pt-2"}>
          <BodyText>
            If you have any suggestions for how to make this tool more useful
            for keeping big cloud honest, please head to our{" "}
            <a href={"https://github.com/Taloflow/is-aws-down/discussions"}>Github discussion page</a>.
          </BodyText>
        </div>
      </StandardCard>
    </section>
  );
};
