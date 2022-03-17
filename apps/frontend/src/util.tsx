type HeadingResolverProps = {
  level: number;
  children: JSX.Element[];
};

const Headings: React.FC<HeadingResolverProps> = ({ level, children }) => {
  // Access actual (string) value of heading
  const heading = children[0].props.value;

  // If we have a heading, make it lower case
  let anchor = typeof heading === 'string' ? heading.toLowerCase() : '';

  // Clean anchor (replace special characters whitespaces).
  // Alternatively, use encodeURIComponent() if you don't care about
  // pretty anchor links
  anchor = anchor.replace(/[^a-zA-Z0-9 ]/g, '');
  anchor = anchor.replace(/ /g, '-');

  // Utility
  const container = (children: React.ReactNode): JSX.Element => (
      <a id={anchor} href={`#${anchor}`}>
  <span>{children}</span>
  </a>
);

  switch (level) {
    case 1:
      return <h1>{container(children)}</h1>;
    case 2:
      return <h2>{container(children)}</h2>;
    case 3:
      return <h3>{container(children)}</h3>;

    default:
      return <h6>{container(children)}</h6>;
  }
};

export default Headings;