export const StandardCard = ({
  children,
  extraClasses,
}: {
  children: React.ReactChild | React.ReactChild[];
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
