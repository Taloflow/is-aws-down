export const SecondaryTitle = ({
  children,
  extraClasses,
}: {
  children: React.ReactChild | React.ReactChild[];
  extraClasses?: string;
}) => {
  return <h1 className={"text-2xl font-bold " + extraClasses}>{children}</h1>;
};
