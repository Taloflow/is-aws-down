import Head from "next/head";

type ComponentProps = {
  Title: string;
  Description: string;
};

export const SEO = (props: ComponentProps) => {
  return (
    <Head>
      <title>{`${props.Title} | Taloflow`}</title>
      <meta name={"description"} content={props.Description} />
      <link
        href="https://uploads-ssl.webflow.com/5c553e9fc3ddd3400fe58821/5c5dde805cf96a735a45c676_taloflow-favicon.png"
        rel="shortcut icon"
        type="image/x-icon"
      />
      <link
        href="https://uploads-ssl.webflow.com/5c553e9fc3ddd3400fe58821/5c575ffe0464303a96b26dc7_taloflow-webclip.png"
        rel="apple-touch-icon"
      />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
};
