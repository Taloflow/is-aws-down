import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetStaticPropsResult, InferGetStaticPropsType } from "next";
import ReactMarkdown from "react-markdown";
import { AWSStats } from "~/components/AWSStats";
import { IndexPageLayout } from "~/components/IndexPageLayout";
import { fetchAWSStatusOverview } from "~/hooks/use-aws-status-overview";
import { NextPageWithLayout } from "~/types";
import { getMDXPost } from "~/util/get-mdx-post";

export const getStaticProps = async () => {
  const queryClient = new QueryClient()
  
  await queryClient.prefetchQuery(['status-overview'], fetchAWSStatusOverview)

  const dehydratedState = dehydrate(queryClient)

  const post = await getMDXPost("check-if-aws-is-down.md")

  const props = { post, dehydratedState } as const
  return {
    props,
    revalidate: 1,
  } as GetStaticPropsResult<typeof props>;
}

type IndexPageProps = InferGetStaticPropsType<typeof getStaticProps>;

const IndexPage: NextPageWithLayout<IndexPageProps> = ({ post }) => {
  return (
    <>
      <AWSStats />
      <div
        id={"debug"}
        className={
          "prose mt-12 prose-slate mx-auto bg-white px-4 shadow-sm rounded-lg py-1 max-w-[900px] lg:w-[900px]"
        }
      >
        <ReactMarkdown className={"py-1 -mt-8"}>{post.content}</ReactMarkdown>
      </div>
    </>
  );
}

IndexPage.getLayout = IndexPageLayout

export default IndexPage;