import { BlankNavbar } from "../../components/general/blankNavBar";
import { MainTitle } from "../../components/blocks/text/mainTitle";
import { StandardCard } from "../../components/blocks/containers/standardCard";
import { SecondaryTitle } from "../../components/blocks/text/secondaryTitle";
import { BodyText } from "../../components/blocks/text/bodyText";
import { Form, Field } from "react-final-form";
import { CtaButton } from "../../components/blocks/buttons/ctaButton";
import { useState } from "react";

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
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const onSubmit = async (values) => {
    setErrorMessage("");
    setSuccessMessage("");
    setSubmitting(true);
    let response = await fetch(
      "https://aws-health-check-api-gmoizr7c4q-uc.a.run.app/users",
      {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "content-type": "application/json",
        },
      }
    );
    if (![201, 400].includes(response.status)) {
      window.alert(
        "Something went wrong submitting your form, mind alerting us on Github?"
      );
    }
    let body = await response.json();
    if (response.status === 400) {
      setErrorMessage(body.detail);
    }
    if (response.status === 201) {
      setSuccessMessage("Successfully registered");
    }
    setSubmitting(false);
  };

  const InitialValues: FormSubmission = {
    email: "",
    alert_cadence: "fiveInARow",
    signup_for: ["actionsLaunch", "taloflowLaunch"],
  };

  return (
    <div>
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
          <Form
            onSubmit={onSubmit}
            initialValues={InitialValues}
            validate={(values) => {
              const errors = {} as any;
              if (!values.email) {
                errors.email = "Required";
              }
              return errors;
            }}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <form
                className={"sm:px-8"}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className={"flex flex-col space-y-8"}>
                  <RadioOrCheckBoxFormChoices
                    Type={"checkbox"}
                    FormName={"signup_for"}
                    Options={[
                      {
                        Description:
                          "Sign up for future “actions” alerts launch",
                        Value: "actionsLaunch",
                      },
                      {
                        Description:
                          "Alert me when Taloflow launches similar free tools",
                        Value: "taloflowLaunch",
                      },
                    ]}
                    TitleName={"Future Services"}
                  />
                  <RadioOrCheckBoxFormChoices
                    Type={"checkbox"}
                    FormName={"service_alerts"}
                    Options={[
                      {
                        Description: "IAM",
                        Value: "IAM",
                      },
                      {
                        Description: "EC2",
                        Value: "EC2",
                      },
                      {
                        Description: "SQS",
                        Value: "SQS",
                      },
                      {
                        Description: "S3",
                        Value: "S3",
                      },
                      {
                        Description: "DynamoDB",
                        Value: "DynamoDB",
                      },
                      {
                        Description: "API Gateway",
                        Value: "API Gateway"
                      },
                      {
                        Description: "Lambda",
                        Value: "Lambda",
                      },
                    ]}
                    TitleName={"Available Services to monitor"}
                  />
                  <RadioOrCheckBoxFormChoices
                    Type={"checkbox"}
                    FormName={"service_regions"}
                    Options={[
                      { Description: "us-east-1", Value: "us-east-1" },
                      { Description: "us-east-2", Value: "us-east-2" },
                      { Description: "us-west-1", Value: "us-west-1" },
                      { Description: "us-west-2", Value: "us-west-2" },
                      { Description: "eu-west-1", Value: "eu-west-1" },
                      { Description: "eu-west-2", Value: "eu-west-2" },
                      { Description: "sa-east-1", Value: "sa-east-1" },
                      { Description: "ap-south-1", Value: "ap-south-1" },
                      { Description: "ap-southeast-2", Value: "ap-southeast-2" },
                      { Description: "ca-central-1", Value: "ca-central-1" },
                    ]}
                    TitleName={"Available Regions"}
                  />
                  <RadioOrCheckBoxFormChoices
                    Type={"radio"}
                    FormName={"alert_cadence"}
                    Options={[
                      {
                        Description: "Every failed health check",
                        Value: "every",
                      },
                      {
                        Description: "5 fails in a row",
                        Value: "fiveInARow",
                      },
                    ]}
                    TitleName={"Threshold"}
                  />
                  <div>
                    <label className={"text-2xl font-bold"}>Send VIA</label>

                    <div
                      className={
                        "flex flex-col border-2 mt-4 border-brand rounded-lg p-4 max-w-[fit-content]"
                      }
                    >
                      {/*This is a dummy field. All users are signed up via email*/}
                      <label className={"text-xl font-medium pt-2"}>
                        <input
                          readOnly={true}
                          name={"communicationPreference"}
                          type={"radio"}
                          checked={true}
                        />

                        <span className={"text-xl pl-4"}>{"Email"}</span>
                      </label>
                    </div>
                    <p className={"text-2xl font-light pt-4"}>
                      Other methods coming soon
                    </p>
                  </div>
                  <div>
                    <label className={"text-2xl font-bold"}>Your Email</label>
                    <label
                      className={
                        "text-xl max-w-lg font-medium flex flex-col cursor-pointer pt-2"
                      }
                    >
                      <Field name={"email"}>
                        {({ input, meta }) => (
                          <div className={"flex flex-col"}>
                            <input
                              {...input}
                              className={
                                "border-none bg-neutral-light py-3 rounded-lg text-xl mt-2"
                              }
                              placeholder={"keep-big-cloud-honest@taloflow.ai"}
                              autoComplete={"email"}
                              type={"email"}
                            />
                            {meta.error &&
                              meta.touched &&
                              !meta.submitSucceeded &&
                              !meta.submitting &&
                              !meta.modifiedSinceLastSubmit && (
                                <span className={"pt-2 text-danger"}>
                                  {meta.error || meta.submitError}
                                </span>
                              )}
                          </div>
                        )}
                      </Field>
                    </label>
                  </div>
                  <div>
                    <CtaButton
                      text={"Sign up for alerts"}
                      disabled={submitting}
                      type={"submit"}
                    />
                    {errorMessage !== "" && (
                      <div className={"mt-2"}>
                        <BodyText extraClasses={"text-danger font-bold"}>
                          {errorMessage}
                        </BodyText>
                      </div>
                    )}
                    {successMessage !== "" && (
                      <div className={"mt-2"}>
                        <BodyText extraClasses={"text-success font-bold"}>
                          {successMessage}
                        </BodyText>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}
          />
        </StandardCard>
      </section>
    </div>
  );
}

type FormChoices = {
  TitleName: string;
  Options: Options[];
  Type: "checkbox" | "radio" | "text";
  FormName: string;
};

type Options = {
  Description: string;
  Value: string;
};

export const RadioOrCheckBoxFormChoices = (props: FormChoices) => {
  return (
    <div className={"flex flex-col"}>
      <label className={"text-2xl font-bold"}>{props.TitleName}</label>
      {props.Options.map((option) => {
        return (
          <label
            key={option.Value}
            className={"text-xl font-medium cursor-pointer pt-2"}
          >
            <Field
              name={props.FormName}
              component={"input"}
              type={props.Type}
              value={option.Value}
            />
            <span className={" pl-4"}>{option.Description}</span>
          </label>
        );
      })}
    </div>
  );
};
