// When linking to an jump link, the title is obscured by the navbar unless we do this
export const IdHref = ({ name }: { name: string }) => {
  return (
    <div className={"relative"}>
      <div id={name} className={"absolute -top-20"} />
    </div>
  );
};
