export const MainTitle = ({
  children,
  extraClasses,
}: {
  children: React.ReactChild | React.ReactChild[];
  extraClasses?: string;
}) => {
  return (
    <h1 className={"text-2xl sm:text-4xl font-bold " + extraClasses}>
      {children}
    </h1>
  );
};
