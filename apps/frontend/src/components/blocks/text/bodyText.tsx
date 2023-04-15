import type { ReactNode } from "react";

export const BodyText = ({
  children,
  extraClasses,
}: {
  children: ReactNode
  extraClasses?: string;
}) => {
  return (
    <p className={"text-lg leading-relaxed " + extraClasses}>{children}</p>
  );
};
