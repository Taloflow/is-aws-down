type NavBarProps = {
  StatsIsVisible: boolean;
  VotingGameIsVisible: boolean;
  S3IsVisible: boolean;
  EC2IsVisible: boolean;
  LambdaIsVisible: boolean;
  DynamoDBIsVisible: boolean;
  APIGatewayIsVisible: boolean;
};

export const Navbar = (props: NavBarProps) => {
  return (
    <nav className={"mb-24"}>
      <div
        className={
          " bg-[#0A0C24] py-4 px-6 text-white no-underline text-lg  fixed top-0 w-full z-40"
        }
      >
        <div className={"max-w-7xl mx-auto justify-between flex"}>
          <div>
            <a href={"https://www.taloflow.ai"} className={"inline-block mr-4"}>
              <svg
                width="40"
                height="100%"
                viewBox="0 0 84 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.759 5.43103L26.2633 0L44 17.5L26.2633 35L20.759 29.569L29.1041 21.3352H0V13.6546H29.0938L20.759 5.43103Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M84 17.5C84 27.165 76.1651 35 66.5001 35C56.8351 35 49 27.165 49 17.5C49 7.83503 56.8351 0 66.5001 0C76.1651 0 84 7.83503 84 17.5ZM76.7068 17.5C76.7068 22.9209 72.2723 27.5626 66.5001 27.5626C60.7279 27.5626 56.2934 22.9209 56.2934 17.5C56.2934 12.0792 60.7279 7.43752 66.5001 7.43752C72.2723 7.43752 76.7068 12.0792 76.7068 17.5Z"
                  fill="white"
                />
              </svg>
            </a>
            <NavbarLink link={"#stats"} isActive={props.StatsIsVisible}>
              Stats
            </NavbarLink>
            <NavbarLink
              link={"#is-sqs-down"}
              isActive={props.VotingGameIsVisible}
            >
              SQS + EC2
            </NavbarLink>
            <NavbarLink link={"#is-s3-down"} isActive={props.S3IsVisible}>
              S3
            </NavbarLink>
            <NavbarLink link={"#is-ec2-down"} isActive={props.EC2IsVisible}>
              EC2
            </NavbarLink>
            <NavbarLink
              link={"#is-lambda-down"}
              isActive={props.LambdaIsVisible}
            >
              Lambda
            </NavbarLink>
            <NavbarLink
              link={"#is-dynamodb-down"}
              isActive={props.DynamoDBIsVisible}
            >
              DynamoDB
            </NavbarLink>
            <NavbarLink
              link={"#is-api-gateway-down"}
              isActive={props.APIGatewayIsVisible}
            >
              API Gateway
            </NavbarLink>
          </div>
          <div>
            <a
              className={
                "no-underline bg-white rounded-lg text-brand-accent text-sm md:text-lg font-bold px-4 py-2"
              }
              href={"https://github.com/Taloflow/is-aws-down/discussions"}
              target={"_blank"}
            >
              Github Discussion Page
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

type NavbarLinkProps = {
  link: string;
  isActive: boolean;
  children: React.ReactChild | React.ReactChild[];
};

const NavbarLink = (props: NavbarLinkProps) => {
  return (
    <div className={"relative hidden md:inline-block"}>
      <a
        className={
          " no-underline font-medium hover:bg-brand-accent hover:bg-opacity-60 px-4 py-2 rounded-lg transition-colors"
        }
        href={props.link}
      >
        {props.children}
      </a>
      <div
        className={`h-2 w-full bg-brand-accent absolute transition-opacity -bottom-4 ${
          props.isActive ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};
