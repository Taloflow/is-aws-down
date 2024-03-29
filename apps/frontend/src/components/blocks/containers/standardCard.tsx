import type { ReactNode } from "react";

export const StandardCard = ({
  children,
  extraClasses,
}: {
  children: ReactNode
  extraClasses?: string;
}) => {
  return (
    <div
      className={
        "shadow-largeCardShadow px-6 py-6 mt-8 bg-white rounded-lg " +
        extraClasses
      }
    >
      {children}
    </div>
  );
};
