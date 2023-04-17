import type { ReactNode } from "react";

export const MainTitle = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string;
}) => {
  return (
    <h1 className={"text-2xl sm:text-4xl font-bold " + className}>
      {children}
    </h1>
  );
};
