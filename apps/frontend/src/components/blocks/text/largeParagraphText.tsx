export const LargeParagraphText = ({
  children,
  extraClasses,
}: {
  children: React.ReactChild | React.ReactChild[];
  extraClasses?: string;
}) => {
  return (
    <p
      className={
        "text-lg sm:text-xl font-medium leading-relaxed " + extraClasses
      }
    >
      {children}
    </p>
  );
};
