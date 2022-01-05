import { Provider } from "react-redux";
import Head from "next/head";
import { AppProps } from "next/app";
import "../styles/index.css";
import "tippy.js/dist/tippy.css"; // optional
import { store } from "../app/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

const isProduction = process.env.NODE_ENV === "production";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <Head>
          <title>AWS Us East 1 Status | Taloflow</title>
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
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
