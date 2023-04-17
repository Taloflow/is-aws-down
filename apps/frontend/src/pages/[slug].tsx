import path from "path";
import fs from "fs/promises";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetStaticPaths, GetStaticPropsContext, GetStaticPropsResult, InferGetStaticPropsType } from "next";
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

export const getStaticPaths: GetStaticPaths = async () => {
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
  const slug = params!.slug

  await queryClient.prefetchQuery(['regions', slug, 'metrics'], async () => {
    const metrics = await fetchRegionMetrics(slug)
    return transformData(metrics)
  })

  const filePath = path.join(process.cwd(), "data", slug + ".json");
  const file = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(file) as RegionFile;
  const pageTitle = `AWS ${data['regionNameUpperCase'].replace(/\s/gi, '-')} Status`
  const canonicalURL = `https://www.taloflow.ai/is-aws-down/${slug}`

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
      <main className={"mt-48 flex flex-col gap-8 pb-24"}>
        <SEO
          Title={pageTitle}
          Description={'Debug Steps and Monitoring Of 10 Regions'}
          canonicalURL={canonicalURL}
        />
        <div className="main-column mx-auto">
          <RegionStatusCard
            regionName={region.name.capitalized}
            regionURL={region.name.forURL}
          />
          <HNAlert />
          <section data-section id="stats">
            <RegionLiveChart
              regionURL={region.name.forURL}
              analyticsSourceName={"GCP"}
            />
          </section>
        </div>
        <CTA />
        <section className="main-column mx-auto">
          <MainTitle>
            Applications Running on {region.name.capitalized}
          </MainTitle>
          <div className="flex flex-col gap-32">
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
            <div data-section id='is-s3-down'>
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
            <div className={"grid grid-cols-1 sm:grid-cols-2 gap-4"} id='is-ec2-down' data-section>
              {/* flex sm:flex-row flex-col mt-16 sm:mt-36 pb-64 */}
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
              <div className={"sm:ml-8 mt-8 sm:mt-0"}>
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
                    sectionId='is-ec2-down'
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

RegionPage.getLayout = RegionPageLayout

export default RegionPage