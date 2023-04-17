import clsx from "clsx";
import { ReactNode, memo } from "react";

interface ChoiceProps {
  percentage: number;
  color: string;
  children?: ReactNode;
  votes: number;
}

export const Choice = memo(({ color, children, votes, percentage }: ChoiceProps) => {
  return (
    <>
      <div className={"flex items-center flex-col sm:flex-row justify-between"}>
        <div className={"flex-1 w-full"}>
          <div
            className={clsx('py-4 pr-4  mr-4 transition-transform will-change-transform rounded-tr-lg rounded-br-lg relative', color)}
            // This is handled with transform so we get buttery smooth animation
            // If the value is zero, show a sliver
            style={{
              transform: `${
                votes === 0
                  ? `translate(-99.5%)`
                  : `translate(-${103 - percentage}%)`
              }`,
            }}
          >
            <span
              className={`
            ${
              votes < 15 ? "text-neutral-text translate-x-12" : "text-white"
            }
             text-right block font-bold text-xl transition relative
            `}
            >
              {votes}{" "}
            </span>
          </div>
        </div>
        {children}
      </div>
    </>
  );
});
