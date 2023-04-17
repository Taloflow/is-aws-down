import type { ReactNode } from "react";

export const SecondaryTitle = ({
  children,
  extraClasses,
}: {
  children: ReactNode
  extraClasses?: string;
}) => {
  return <h1 className={"text-2xl font-bold " + extraClasses}>{children}</h1>;
};
