// Sometimes we don't want text to extend too far for readability's sake.
// Here, we define the size of that container
export const TruncatedTextContainer = ({
  children,
}: {
  children: React.ReactChild | React.ReactChild[];
}) => {
  return <div className={"max-w-2xl"}>{children}</div>;
};
