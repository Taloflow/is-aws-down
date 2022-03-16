import { useState } from "react";
import { Navbar } from "../healthCheckPageElements/navbar";
import { InView } from "react-intersection-observer";
import { AWSIsUpOrDown } from "../healthCheckPageElements/awsIsUpOrDown";
import { HNAlert } from "../healthCheckPageElements/HNAlert";
import { IdHref } from "../blocks/idHref";
import { HealthCheckDashboardContainer } from "../healthCheckApplications/dashboard/healthCheckDashboard";
import { CTA } from "../healthCheckPageElements/CTA";
import { MainTitle } from "../blocks/text/mainTitle";
import { VotingGameContainer } from "../healthCheckApplications/votingGame/votingGameContainer";
import { S3 } from "../healthCheckApplications/s3";
import { QuoteGenerator } from "../healthCheckApplications/QuoteGenerator";
import { ShadeGenerator } from "../healthCheckApplications/shadeGenerator";
import { Footer } from "../healthCheckPageElements/footer";

export type FullPageProps = {
  regionNameForURL: string; // For https://gcp-dashboard-generator.taloflow.ai/metrics?region=us-west-2&groupby=minute
  regionNameLowerCase: string;
  regionNameUpperCase: string;
  votingGameEndpoint: string;
  dashBoardEndpoint: string;
  S3Endpoint: string;
  QuoteEndpoint: string;
  LambdaEndpoint: string;
};

export const HealthCheckPage = (props: FullPageProps) => {
  // I have all these pieces of state at the page level to:
  // 1. Let the navbar highlight when something is in view
  // 2. Only poll some of the applications when the component is in view
  const [statsIsVisible, setStatsIsVisible] = useState(false);
  const [votingIsVisible, setVotingIsVisible] = useState(false);
  const [S3IsVisible, setS3IsVisible] = useState(false);
  const [Ec2IsVisible, setEc2IsVisible] = useState(false);
  const [LambdaIsVisible, setLambdaIsVisible] = useState(false);
  const [titleSectionIsVisible, setTitleSectionIsVisible] = useState(false);

  return (
    <div>
      <Navbar
        StatsIsVisible={statsIsVisible}
        VotingGameIsVisible={votingIsVisible}
        S3IsVisible={S3IsVisible}
        EC2IsVisible={Ec2IsVisible}
        LambdaIsVisible={LambdaIsVisible}
      />
      <main className={"main-column mx-auto mt-48"}>
        <InView
          as="div"
          rootMargin={"-25%"}
          onChange={(inview, entry) => setTitleSectionIsVisible(inview)}
        >
          <div className={"xl:mx-24 2xl:mx-48"}>
            <AWSIsUpOrDown
              regionNameForEndpoint={props.regionNameForURL}
              ShouldPoll={titleSectionIsVisible}
              RegionName={props.regionNameLowerCase}
            />
          </div>
        </InView>
      </main>
      <HNAlert />
      <InView
        as="div"
        rootMargin={"-25%"}
        onChange={(inview, entry) => setStatsIsVisible(inview)}
      >
        <section className={"main-column mx-auto mt-24"}>
          <IdHref name={"stats"} />
          <HealthCheckDashboardContainer
            Region={props.regionNameForURL}
            AnalyticsSource={"GCP"}
            EndPoint={props.dashBoardEndpoint}
            ShouldPoll={statsIsVisible}
          />
        </section>
      </InView>
      <CTA />
      <section className={"main-column pt-12 sm:pt-24 mx-auto"}>
        <MainTitle>
          Applications Running on {props.regionNameUpperCase}
        </MainTitle>
        <InView
          as="div"
          rootMargin={"-25%"}
          onChange={(inview, entry) => setVotingIsVisible(inview)}
        >
          <div className={"pt-8"}>
            <IdHref name={"is-sqs-down"} />
            <VotingGameContainer
              shouldPoll={votingIsVisible}
              endpointURL={props.votingGameEndpoint}
            />
          </div>
        </InView>
        <div className={"mt-16 sm:mt-36"}>
          <IdHref name={"is-s3-down"} />
          <InView
            as="div"
            rootMargin={"-340px"}
            onChange={(inview, entry) => setS3IsVisible(inview)}
          >
            <S3
              Endpoint={props.S3Endpoint}
              Region={props.regionNameLowerCase}
              AltText={"Jeff Bezos looking regal in an astronaut suit"}
              ServiceName={"S3"}
            />
          </InView>
        </div>

        <div className={"flex sm:flex-row flex-col mt-16 sm:mt-36 pb-64"}>
          <IdHref name={"is-ec2-down"} />
          <div className={"flex-1"}>
            <InView
              as="div"
              rootMargin={"-25%"}
              onChange={(inview, entry) => setEc2IsVisible(inview)}
            >
              <QuoteGenerator
                Title={"EC2 Bezos Quote Generator"}
                SubHeadline={
                  "From his book “Invent and Wander: The Collected Writings of Jeff Bezos”"
                }
                Endpoint={props.QuoteEndpoint}
                Shouldrun={Ec2IsVisible}
              />
            </InView>
          </div>
          <InView
            as="div"
            className={"flex-1"}
            rootMargin={"-25%"}
            onChange={(inview, entry) => setLambdaIsVisible(inview)}
          >
            <div className={"sm:ml-8 mt-8 sm:mt-0"}>
              <IdHref name={"is-lambda-down"} />
              <ShadeGenerator
                Title={"Lambda Random Shade Generator"}
                SubHeadline={
                  "Runs through API gateway. Hate something about a cloud provider that you want added?"
                }
                Endpoint={props.LambdaEndpoint}
                ShouldRun={LambdaIsVisible}
              />
            </div>
          </InView>
        </div>
      </section>
    </div>
  );
};
