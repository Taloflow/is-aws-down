import { ReactNode } from "react";

export const LargeParagraphText = ({
  children,
  className,
}: {
  children?: ReactNode
  className?: string;
}) => {
  return (
    <p
      className={
        "text-lg sm:text-xl font-medium leading-relaxed " + className
      }
    >
      {children}
    </p>
  );
};
