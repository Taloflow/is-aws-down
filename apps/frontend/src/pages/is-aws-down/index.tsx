import { useGetStatsQuery } from "../../features/summaryPage/summaryAPI";
import { Spinner } from "../../components/blocks/spinner";
import { FailureState } from "../../components/healthCheckApplications/failureState";
import { LargeParagraphText } from "../../components/blocks/text/largeParagraphText";
import { SEO } from "../../components/seo";
import { RegionCard } from "../../components/summaryPage/regionCard";
import { AWSIsUpOrDown } from "../../components/healthCheckPageElements/awsIsUpOrDown";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import ReactMarkdown from "react-markdown";

export default function IsAwsDown({ frontmatter, content }) {
  const { data, isLoading, error } = useGetStatsQuery("");

  if (isLoading) {
    return (
      <div>
        <SEO
          Title={"Is AWS Down? AWS Health Checks And Debugging Steps"}
          Description={"Debug Steps and Monitoring Of 10 Regions "}
        />
        <div className={"h-8 mx-auto mt-12 w-8"}>
          <Spinner />
        </div>
        <div
          className={
            "prose mt-12 prose-slate mx-auto bg-white px-4 shadow-sm rounded-lg py-1 max-w-[900px] lg:w-[900px]"
          }
        >
          <ReactMarkdown className={"py-4"}>{content}</ReactMarkdown>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className={"max-w-[550px] mx-auto"}>
          <SEO
            Title={"Is AWS Down? AWS Health Checks And Debugging Steps"}
            Description={"Debug Steps and Monitoring Of 10 Regions "}
          />
          <FailureState>
            <LargeParagraphText>
              <span className={"text-danger text-center block"}>
                {" "}
                Error loading this page. This page is served from GCP. There may
                be an issue.
              </span>
            </LargeParagraphText>
          </FailureState>
        </div>
        <div
          className={
            "prose mt-12 prose-slate mx-auto bg-white px-4 shadow-sm rounded-lg py-1 max-w-[900px] lg:w-[900px]"
          }
        >
          <ReactMarkdown className={"py-4"}>{content}</ReactMarkdown>
        </div>
      </>
    );
  }
  return (
    <div>
      <SEO
        Title={"Is AWS Down? AWS Health Checks And Debugging Steps"}
        Description={"Debug Steps and Monitoring Of 10 Regions "}
      />
      <div className={"container max-w-[900px] mx-auto mt-24"}>
        <AWSIsUpOrDown
          RegionName={""}
          IsSummaryPage={true}
          ShouldPoll={true}
          SummaryData={data}
          SummaryDataFetchError={error}
          regionNameForEndpoint={""}
        />
      </div>
      <div
        className={
          "container mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-auto"
        }
      >
        {data.map((datum) => {
          return <RegionCard key={datum.region} Summary={datum} />;
        })}
      </div>
      <div
        id={"debug"}
        className={
          "prose mt-12 prose-slate mx-auto bg-white px-4 shadow-sm rounded-lg py-1 max-w-[900px] lg:w-[900px]"
        }
      >
        <ReactMarkdown className={"py-1 -mt-8"}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  // MDX text - can be from a local file, database, anywhere
  let filePath = path.join("posts", "check-if-aws-is-down.md");

  let file = fs.readFileSync(filePath, "utf-8");

  const { data: frontmatter, content } = matter(file);

  return { props: { frontmatter, content } };
  // const source = "Some **mdx** text, with a component";
  // return {
  //   props: {
  //     source: source,
  //   },
  // };
}
