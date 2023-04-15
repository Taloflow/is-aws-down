import path from "path";
import fs from "fs/promises";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetStaticPropsContext, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { NextPageWithLayout } from "~/types";
import { SEO } from "~/components/seo";
import { RegionPageLayout } from "~/components/RegionPageLayout";
import { HNAlert } from "~/components/healthCheckPageElements/HNAlert";
import { CTA } from "~/components/healthCheckPageElements/CTA";
import { MainTitle } from "~/components/blocks/text/mainTitle";
import { S3Image } from "~/components/S3Image";
import { fetchRegionMetrics } from '~/hooks/use-region-metrics'
import { transformData } from "~/hooks/use-region-metrics/transform";
import { RegionLiveChart } from "~/components/RegionLiveChart";
import { RegionStatusCard } from "~/components/RegionStatusCard";
import { LargeParagraphText } from "~/components/blocks/text/largeParagraphText";
import { TruncatedTextContainer } from "~/components/blocks/containers/truncatedTextContainer";
import { BodyText } from "~/components/blocks/text/bodyText";
import { VotingApp } from "~/components/VotingApp";
import { StandardCard } from "~/components/blocks/containers/standardCard";
import { QuoteGenerator } from "~/components/QuoteGenerator";
import { ShadeGenerator } from "~/components/ShadeGenerator";

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

export const getStaticProps = async ({ params }: GetStaticPropsContext<{ slug: string; }>) => {
  const queryClient = new QueryClient()

  if (!params) return { notFound: true }

  await queryClient.prefetchQuery(['regions', params.slug, 'metrics'], async () => {
    const metrics = await fetchRegionMetrics(params.slug)
    return transformData(metrics)
  })

  const filePath = path.join(process.cwd(), "data", params.slug + ".json");
  const file = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(file) as RegionFile;
  const pageTitle = `AWS ${data['regionNameUpperCase'].replace(/\s/gi, '-')} Status`
  const canonicalURL = `https://www.taloflow.ai/is-aws-down/${params.slug}`

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
    canonicalURL,
    dehydratedState: dehydrate(queryClient)
  } as const

  return {
    props,
    revalidate: 1,
  } as GetStaticPropsResult<typeof props>;
}

type RegionPageProps = InferGetStaticPropsType<typeof getStaticProps>

const RegionPage: NextPageWithLayout<RegionPageProps> = ({ canonicalURL, pageTitle, region }) => {
  return (
    <>
      <main className={"main-column mx-auto mt-48"}>
        <SEO
          Title={pageTitle}
          Description={'Debug Steps and Monitoring Of 10 Regions'}
          canonicalURL={canonicalURL}
        />
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
            <div className={"flex flex-col relative"}>
              <LargeParagraphText>
                <span className={"font-bold"}>{"EC2 Bezos Quote Generator"}</span>
              </LargeParagraphText>
              <TruncatedTextContainer>
                <BodyText>{"From his book “Invent and Wander: The Collected Writings of Jeff Bezos”"}</BodyText>
              </TruncatedTextContainer>
              <QuoteGenerator
                apiURL={region.resource.quote}
                sectionId='is-ec2-down'
                regionURL={region.name.forURL}
              />
            </div>
          </div>
          <div className={"sm:ml-8 mt-8 sm:mt-0"} data-section id='is-lambda-down'>
            <div className={"flex flex-col"}>
              <LargeParagraphText>
                <span className={"font-bold"}>{"Lambda Random Shade Generator"}</span>
              </LargeParagraphText>
              <TruncatedTextContainer>
                <BodyText>
                  {"Runs through API gateway. Hate something about a cloud provider that you want added?"}{" "}
                  <a href="https://github.com/Taloflow/is-aws-down/discussions/6">
                    Tell us what it is here.
                  </a>
                </BodyText>
              </TruncatedTextContainer>
              <ShadeGenerator
                apiURL={region.resource.lambda}
                regionURL={region.name.forURL}
                sectionId='is-lambda-down'
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

RegionPage.getLayout = RegionPageLayout

export default RegionPage