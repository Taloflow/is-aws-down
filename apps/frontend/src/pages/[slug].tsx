import path from "path";
import fs from "fs/promises";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { NextPageWithLayout } from "~/types";
import Head from "next/head";
import { SEO } from "~/components/seo";
import { RegionPageLayout } from "~/components/RegionPageLayout";
import { HNAlert } from "~/components/healthCheckPageElements/HNAlert";
import { CTA } from "~/components/healthCheckPageElements/CTA";
import { MainTitle } from "~/components/blocks/text/mainTitle";
import { S3Image } from "~/components/S3Image";
// import { QuoteGenerator } from "~/components/healthCheckApplications/QuoteGenerator";
// import { ShadeGenerator } from "~/components/healthCheckApplications/shadeGenerator";
import { fetchRegionMetrics } from '~/hooks/use-region-metrics'
import { transformData } from "~/hooks/use-region-metrics/transform";
import { RegionLiveChart } from "~/components/RegionLiveChart";
import { RegionStatusCard } from "~/components/RegionStatusCard";
import { LargeParagraphText } from "~/components/blocks/text/largeParagraphText";
import { TruncatedTextContainer } from "~/components/blocks/containers/truncatedTextContainer";
import { BodyText } from "~/components/blocks/text/bodyText";
import { VotingApp } from "~/components/VotingApp";
import { StandardCard } from "~/components/blocks/containers/standardCard";

type RegionFile = {
  regionNameForURL: string;
  regionNameLowerCase: string;
  regionNameUpperCase: string;
  dashBoardEndpoint: string;
  votingGameEndpoint: string;
  S3Endpoint: string;
  QuoteEndpoint: string;
  LambdaEndpoint: string;
}

export async function getStaticPaths() {
  const filePath = path.join("data");
  const files = await fs.readdir(filePath);

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".json", ""),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps = async ({ params }) => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['regions', params.slug, 'metrics'], async () => {
    const metrics = await fetchRegionMetrics(params.slug)
    return transformData(metrics)
  })

  const filePath = path.join(process.cwd(), "data", params.slug + ".json");
  const file = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(file) as RegionFile;
  const pageTitle = `AWS ${data['regionNameUpperCase'].replace(/\s/gi, '-')} Status`

  const region = {
    name: {
      forURL: data.regionNameForURL,
      capitalized: data.regionNameUpperCase,
      lowerCase: data.regionNameLowerCase,
    },
    resource: {
      dashboard: data.dashBoardEndpoint,
      voting: data.votingGameEndpoint,
      storage: data.S3Endpoint,
      quote: data.QuoteEndpoint,
      lambda: data.LambdaEndpoint
    }
  } as const

  const props = {
    region,
    pageTitle,
    dehydratedState: dehydrate(queryClient)
  } as const

  return {
    props,
    revalidate: 1,
  } as GetStaticPropsResult<typeof props>;
}

type RegionPageProps = InferGetStaticPropsType<typeof getStaticProps>

const RegionPage: NextPageWithLayout<RegionPageProps> = ({ pageTitle, region }) => {
  return (
    <>
      <main className={"main-column mx-auto mt-48"}>
        {/* <SEO
        Title={pageTitle}
      /> */}
        <RegionStatusCard
          regionName={region.name.capitalized}
          regionURL={region.name.forURL}
        />
      </main>
      <HNAlert />
      <section data-section className={"main-column mx-auto mt-24"} id="stats">
        <RegionLiveChart
          regionURL={region.name.forURL}
          analyticsSourceName={"GCP"}
        />
      </section>
      <CTA />
      <section className={"main-column pt-12 sm:pt-24 mx-auto"}>
        <MainTitle>
          Applications Running on {region.name.capitalized}
        </MainTitle>
        <div data-section id='is-sqs-down' className={"pt-8"}>
          <LargeParagraphText>
            <span className={"font-bold"}>SQS + EC2 Voting Game</span>
          </LargeParagraphText>
          <div className={"pt-2"}>
            <TruncatedTextContainer>
              <BodyText>
                Only the last 100 votes are tallied. There are no limits to how
                many times you can vote. Go crazy.
              </BodyText>
            </TruncatedTextContainer>
          </div>
          <VotingApp
            endpointURL={region.resource.voting}
            regionURL={region.name.forURL}
          />
        </div>
        <div className={"mt-16 sm:mt-36"} data-section id='is-s3-down'>
          <LargeParagraphText>
            <span className={"font-bold"}>S3 File Serving</span>
          </LargeParagraphText>
          <StandardCard>
            <S3Image
              src={region.resource.storage}
              alt="Jeff Bezos looking regal in an astronaut suit"
              error={
                <span className={"text-danger text-center block"}>
                Requesting{" "}
                <a href={region.resource.storage} target={"_blank"}>
                  this image
                </a>{" "}
                failed. S3 in {region.name.lowerCase} might be down
              </span>
              }
            >
              <div className={"mt-4 sm:my-auto sm:ml-6  "}>
              <LargeParagraphText>
                This image is served from S3 in {region.name.lowerCase}{" "}
                Suggest a new image on our{" "}
                <a href={"https://github.com/Taloflow/is-aws-down/discussions"} target={"_blank"} rel='noopener noreferrer'>
                  GitHub community
                </a>
                .
              </LargeParagraphText>
            </div>
            </S3Image>
          </StandardCard>
        </div>

        <div className={"flex sm:flex-row flex-col mt-16 sm:mt-36 pb-64"} id='is-ec2-down' data-section>
          <div className={"flex-1"}>
            {/* <QuoteGenerator
                Title={"EC2 Bezos Quote Generator"}
                SubHeadline={
                  "From his book “Invent and Wander: The Collected Writings of Jeff Bezos”"
                }
                Endpoint={region.resource.quote}
                // Shouldrun={Ec2IsVisible}
              /> */}
          </div>
          <div className={"sm:ml-8 mt-8 sm:mt-0"} data-section id='is-lambda-down'>
            {/* <ShadeGenerator
                Title={"Lambda Random Shade Generator"}
                SubHeadline={
                  "Runs through API gateway. Hate something about a cloud provider that you want added?"
                }
                Endpoint={region.resource.lambda}
                // ShouldRun={LambdaIsVisible}
              /> */}
          </div>
        </div>
      </section>
    </>
  )
}

RegionPage.getLayout = RegionPageLayout

export default RegionPage