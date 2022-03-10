import { HealthCheckDashboardContainer } from "../../components/healthCheckApplications/dashboard/healthCheckDashboard";
import { MainTitle } from "../../components/blocks/text/mainTitle";
import { VotingGameContainer } from "../../components/healthCheckApplications/votingGame/votingGameContainer";
import { S3 } from "../../components/healthCheckApplications/s3";
import { QuoteGenerator } from "../../components/healthCheckApplications/QuoteGenerator";
import { ShadeGenerator } from "../../components/healthCheckApplications/shadeGenerator";
import { useState } from "react";
import { HNAlert } from "../../components/healthCheckPageElements/HNAlert";
import { Navbar } from "../../components/healthCheckPageElements/navbar";
import { InView } from "react-intersection-observer";
import { IdHref } from "../../components/blocks/idHref";
import { Footer } from "../../components/healthCheckPageElements/footer";
import { AWSIsUpOrDown } from "../../components/healthCheckPageElements/awsIsUpOrDown";
import { CTA } from "../../components/healthCheckPageElements/CTA";

export default function USEastOne() {
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
              ShouldPoll={titleSectionIsVisible}
              RegionName={"us east-1"}
              regionNameForEndpoint={"us-east-1"}
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
            AnalyticsSource={"GCP"}
            EndPoint={"https://gcp-dashboard.b-cdn.net"}
            ShouldPoll={statsIsVisible}
          />
        </section>
      </InView>
      <CTA />
      <section className={"main-column pt-12 sm:pt-24 mx-auto"}>
        <MainTitle>Applications Running on US East-1</MainTitle>
        <InView
          as="div"
          rootMargin={"-25%"}
          onChange={(inview, entry) => setVotingIsVisible(inview)}
        >
          <div className={"pt-8"}>
            <IdHref name={"is-sqs-down"} />
            <VotingGameContainer
              shouldPoll={votingIsVisible}
              endpointURL={"https://d20v1ybfoa2k7c.cloudfront.net"}
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
              Endpoint={
                "https://taloflow-aws-health-check.s3.amazonaws.com/if-i-get-requested-s3-is-up.jpg"
              }
              Region={"us east 1"}
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
                Endpoint={"https://d1e63eaqx0w02n.cloudfront.net/quote"}
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
                Endpoint={
                  "https://6bitdsm1cl.execute-api.us-east-1.amazonaws.com/prod/shades"
                }
                ShouldRun={LambdaIsVisible}
              />
            </div>
          </InView>
        </div>
      </section>
      <Footer />
    </div>
  );
}
