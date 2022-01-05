import { BodyText } from "../blocks/text/bodyText";

export const Footer = () => {
  return (
    <div className={"bg-neutral-dark"}>
      <div
        className={
          "main-column flex flex-col sm:flex-row justify-between text-white mx-auto"
        }
      >
        <div
          className={
            "flex flex-wrap sm:space-x-4 py-2 items-center sm:mb-0 mb-4"
          }
        >
          <BodyText>
            <span className={"font-bold mr-4"}>©Taloflow Inc.</span>
          </BodyText>
          <a className={"mr-4"} href={"https://www.taloflow.ai/privacy"}>
            Privacy
          </a>
          <a className={"mr-4"} href={"https://www.taloflow.ai/terms"}>
            Terms
          </a>
          <a className={"mr-4"} href={"https://www.taloflow.ai/eula"}>
            License
          </a>
          <a className={"mr-4"} href={"https://www.taloflow.ai/subprocessors"}>
            Subprocessors
          </a>
        </div>
        <div className={"flex space-x-4 items-center"}>
          <a href={"https://twitter.com/TaloHQ"} target={"_blank"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="22"
              viewBox="0 0 27 22"
              fill="none"
            >
              <path
                d="M26.0044 2.93704C25.0474 3.36204 24.0194 3.64804 22.9404 3.77704C24.0424 3.11704 24.8874 2.07204 25.2854 0.826035C24.2554 1.43704 23.1134 1.88104 21.8974 2.12104C20.9244 1.08404 19.5384 0.436035 18.0044 0.436035C15.0584 0.436035 12.6704 2.82504 12.6704 5.77004C12.6704 6.18804 12.7184 6.59603 12.8084 6.98503C8.37542 6.76303 4.44542 4.63903 1.81342 1.41104C1.35542 2.19904 1.09242 3.11504 1.09242 4.09404C1.09242 5.94404 2.03342 7.57704 3.46442 8.53304C2.59042 8.50504 1.76742 8.26504 1.04842 7.86604C1.04842 7.88904 1.04842 7.91003 1.04842 7.93303C1.04842 10.518 2.88642 12.674 5.32742 13.163C4.88042 13.285 4.40842 13.35 3.92142 13.35C3.57842 13.35 3.24342 13.316 2.91842 13.255C3.59742 15.374 5.56742 16.917 7.90142 16.96C6.07642 18.391 3.77642 19.244 1.27642 19.244C0.846418 19.244 0.421418 19.219 0.00341797 19.169C2.36442 20.682 5.16742 21.565 8.18042 21.565C17.9924 21.565 23.3564 13.437 23.3564 6.38803C23.3564 6.15703 23.3514 5.92704 23.3414 5.69804C24.3844 4.94504 25.2894 4.00604 26.0044 2.93704Z"
                fill="#fff"
              />
            </svg>
          </a>
          <a
            href={"https://www.linkedin.com/company/taloflow/"}
            target={"_blank"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="22"
              viewBox="0 0 23 22"
              fill="none"
            >
              <path
                d="M20.0044 0H2.00439C0.899395 0 0.00439453 0.895 0.00439453 2V20C0.00439453 21.105 0.899395 22 2.00439 22H20.0044C21.1094 22 22.0044 21.105 22.0044 20V2C22.0044 0.895 21.1094 0 20.0044 0ZM6.9584 18H4.00839V8.508H6.9584V18ZM5.45339 7.151C4.50239 7.151 3.73339 6.38 3.73339 5.431C3.73339 4.482 4.50339 3.712 5.45339 3.712C6.40139 3.712 7.17239 4.483 7.17239 5.431C7.17239 6.38 6.40139 7.151 5.45339 7.151ZM18.0084 18H15.0604V13.384C15.0604 12.283 15.0404 10.867 13.5274 10.867C11.9924 10.867 11.7564 12.066 11.7564 13.304V18H8.80839V8.508H11.6384V9.805H11.6784C12.0724 9.059 13.0344 8.272 14.4694 8.272C17.4564 8.272 18.0084 10.238 18.0084 12.794V18V18Z"
                fill="#fff"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
