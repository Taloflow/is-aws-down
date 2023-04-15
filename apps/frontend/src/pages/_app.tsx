import Head from "next/head";
import "~/styles/fonts.css";
import "~/styles/index.css";
import "tippy.js/dist/tippy.css"; // optional
import { AppPropsWithLayout } from "~/types";
import { DefaultPageLayout } from "~/components/DefaultPageLayout";
import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient())
  const getLayout = Component.getLayout ?? DefaultPageLayout
  return (
    <>
      <Head>
        <link
          href="https://uploads-ssl.webflow.com/5c553e9fc3ddd3400fe58821/5c5dde805cf96a735a45c676_taloflow-favicon.png"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <link
          href="https://uploads-ssl.webflow.com/5c553e9fc3ddd3400fe58821/5c575ffe0464303a96b26dc7_taloflow-webclip.png"
          rel="apple-touch-icon"
        />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          {getLayout(<Component {...pageProps} />)}
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
