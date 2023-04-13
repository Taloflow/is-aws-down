import { ReactNode } from "react";

export const FailureState = ({
  children,
}: {
  children?: ReactNode
}) => {
  return (
    <div
      className={
        "shadow-largeCardShadow px-6 py-6 mt-8 bg-white rounded-lg relative"
      }
    >
      <div className={"flex justify-center flex-col"}>
        {children}
        <div className={"h-[200px] w-[200px] mx-auto"}>
          <img src={process.env.NEXT_PUBLIC_CDN_HOST + "/icons8-fire.gif"} />
        </div>
      </div>
    </div>
  );
};
