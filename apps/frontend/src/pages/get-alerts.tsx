import { BlankNavbar } from "~/components/general/blankNavBar";
import { MainTitle } from "~/components/blocks/text/mainTitle";
import { StandardCard } from "~/components/blocks/containers/standardCard";
import { SecondaryTitle } from "~/components/blocks/text/secondaryTitle";
import { BodyText } from "~/components/blocks/text/bodyText";
import Head from "next/head";
import { AlertForm } from "~/components/AlertForm";
import { SEO } from "~/components/seo";

// What the data for the form submission looks like
export type FormSubmission = {
  signup_for?: SignUpFor[];
  service_alerts?: Services[];
  alert_cadence?: "fiveInARow" | "every";
  email: string; // Required
};

type SignUpFor = "actionsLaunch" | "taloflowLaunch";
type Services = |
  "SQS" | 
  "IAM" | 
  "Lambda" | 
  "S3" | 
  "EC2" | 
  "API Gateway" | 
  "Lambda";
  
type Regions = |
  "us-east-1" |
  "us-east-2" |
  "us-west-1" |
  "us-west-2" |
  "eu-west-1" |
  "eu-west-2" |
  "sa-east-1" |
  "ap-south-1" |
  "ap-southeast-2" |
  "ca-central-1";

export default function GetAlerts() {
  return (
    <div>
      <SEO
        Title='Get AWS Status Alerts'
        Description="Debug Steps and Monitoring Of 10 Regions"
        canonicalURL='https://www.taloflow.ai/is-aws-down/get-alerts'
      />
      <BlankNavbar />
      <section className={"inner-column sm:text-center mx-auto  pt-12"}>
        <MainTitle>
          Be the first to know. Get AWS outage alerts without relying on their
          “status” page
        </MainTitle>
      </section>
      <section className={"inner-column mx-auto mt-12 sm:mt-24"}>
        <StandardCard extraClasses={"border-4 border-brand-accent"}>
          <SecondaryTitle extraClasses={"pb-4"}>
            A Better Way To Get AWS Alerts
          </SecondaryTitle>
          <BodyText extraClasses={"font-medium"}>
            Only get alerted on what you care about. You can set alerts based on:
          </BodyText>
          <ul
            className={
              "list-disc pl-6 !-mt-0 text-lg font-medium leading-relaxed"
            }
          >
            <li>Region</li>
            <li>Service</li>
            <li>Number of failed health checks</li>
          </ul>
          <BodyText extraClasses={"font-medium py-4"}>
            These alerts will try to reach you by your choice combination of
            email, SMS, teams, telegram, slack etc.
          </BodyText>
          <BodyText extraClasses={"font-medium"}>
            Sign up to get alerted when this launches below.{" "}
            <a href={"https://github.com/Taloflow/is-aws-down/discussions"}>Add a feature request here.</a>
          </BodyText>
        </StandardCard>
      </section>
      <section className={"inner-column mx-auto"}>
        <StandardCard>
          <AlertForm />
        </StandardCard>
      </section>
    </div>
  );
}