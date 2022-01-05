import { CtaLink } from "../blocks/buttons/ctaButton";

export const CTA = () => {
  return (
    <div className={"bg-neutral-dark my-24"}>
      <div className={"max-w-2xl mx-auto px-4  py-16"}>
        <p className={"text-3xl font-bold text-center text-white"}>
          Don’t trust the honesty of AWS’s status page?
        </p>
        <p className={"text-xl text-center text-white mt-4 xl:mx-16"}>
          Be the first to know with honest AWS outage alerts delivered right to
          your inbox.
        </p>
        <div className={"flex mt-8 justify-center"}>
          <CtaLink
            href={"/is-aws-down/get-alerts"}
            text={"Set up free AWS outage alerts"}
          />
        </div>
      </div>
    </div>
  );
};
