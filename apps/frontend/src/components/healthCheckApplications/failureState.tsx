import { DefaultOptions } from "../lottie/defaultOptions";
import animationData from "../lottie/simple-fire.json";
import Lottie from "react-lottie";
import fire from "../../../public/icons8-fire.gif";

export const FailureState = ({
  children,
}: {
  children: React.ReactChild | React.ReactChild[];
}) => {
  return (
    <div
      className={
        "shadow-largeCardShadow px-6 py-6 mt-8 bg-white rounded-lg relative"
      }
    >
      <div className={"flex justify-center flex-col"}>
        {children}
        {/*<Lottie*/}
        {/*  options={DefaultOptions(animationData)}*/}
        {/*  height={200}*/}
        {/*  width={200}*/}
        {/*/>*/}
        <div className={"h-[200px] w-[200px] mx-auto"}>
          <img src={process.env.NEXT_PUBLIC_CDN_HOST + "/icons8-fire.gif"} />
        </div>
      </div>
    </div>
  );
};
