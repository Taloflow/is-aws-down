export const BodyText = ({
  children,
  extraClasses,
}: {
  children: React.ReactChild | React.ReactChild[];
  extraClasses?: string;
}) => {
  return (
    <p className={"text-lg leading-relaxed " + extraClasses}>{children}</p>
  );
};
