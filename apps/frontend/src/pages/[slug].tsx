import path from "path";
import fs from "fs";
import {
  FullPageProps,
  HealthCheckPage,
} from "~/components/fullPage/healthCheckPage";
import { QueryClient } from "@tanstack/react-query";
import { GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { NextPageWithLayout } from "~/types";
import Head from "next/head";
import { SEO } from "~/components/seo";
import { RegionPageLayout } from "~/components/RegionPageLayout";
import { HNAlert } from "~/components/healthCheckPageElements/HNAlert";
import { HealthCheckDashboardContainer } from "~/components/healthCheckApplications/dashboard/healthCheckDashboard";
import { CTA } from "~/components/healthCheckPageElements/CTA";
import { MainTitle } from "~/components/blocks/text/mainTitle";
import { VotingGameContainer } from "~/components/healthCheckApplications/votingGame/votingGameContainer";
import { S3 } from "~/components/healthCheckApplications/s3";
import { QuoteGenerator } from "~/components/healthCheckApplications/QuoteGenerator";
import { ShadeGenerator } from "~/components/healthCheckApplications/shadeGenerator";

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
  let filePath = path.join("data");
  const files = fs.readdirSync(filePath);

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
  const filePath = path.join(process.cwd(), "data", params.slug + ".json");
  const file = fs.readFileSync(filePath, "utf8");
  const data = await JSON.parse(file) as RegionFile;
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
  
  // await queryClient.prefetchQuery()

  const props = {
    region,
    pageTitle,
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
      {/* <SEO
        Title={pageTitle}
      /> */}
      <HNAlert />
      <section data-section className={"main-column mx-auto mt-24"} id="stats">
        <HealthCheckDashboardContainer
          Region={region.name.forURL}
          AnalyticsSource={"GCP"}
          EndPoint={region.resource.dashboard}
        />
      </section>
      <CTA />
      <section className={"main-column pt-12 sm:pt-24 mx-auto"}>
        <MainTitle>
          Applications Running on {region.name.capitalized}
        </MainTitle>
        <div data-section id='is-sqs-down' className={"pt-8"}>
          <VotingGameContainer
            // shouldPoll={votingIsVisible}
            endpointURL={region.resource.voting}
          />
        </div>
        <div className={"mt-16 sm:mt-36"} data-section id='is-s3-down'>
            <S3
              Endpoint={region.resource.storage}
              Region={region.name.lowerCase}
              AltText={"Jeff Bezos looking regal in an astronaut suit"}
              ServiceName={"S3"}
            />
        </div>

        <div className={"flex sm:flex-row flex-col mt-16 sm:mt-36 pb-64"} id='is-ec2-down' data-section>
          <div className={"flex-1"}>
              <QuoteGenerator
                Title={"EC2 Bezos Quote Generator"}
                SubHeadline={
                  "From his book “Invent and Wander: The Collected Writings of Jeff Bezos”"
                }
                Endpoint={region.resource.quote}
                // Shouldrun={Ec2IsVisible}
              />
          </div>
            <div className={"sm:ml-8 mt-8 sm:mt-0"} data-section id='is-lambda-down'>
              <ShadeGenerator
                Title={"Lambda Random Shade Generator"}
                SubHeadline={
                  "Runs through API gateway. Hate something about a cloud provider that you want added?"
                }
                Endpoint={region.resource.lambda}
                // ShouldRun={LambdaIsVisible}
              />
            </div>
        </div>
      </section>
    </>
  )
}

RegionPage.getLayout = RegionPageLayout

export default RegionPage