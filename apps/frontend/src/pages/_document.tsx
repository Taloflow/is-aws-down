import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import * as snippet from "@segment/snippet";
import { Router } from "next/router";

const isProduction = process.env.NODE_ENV === "production";

const DEFAULT_WRITE_KEY = "pXZJ3AzXJmrxGPRiWNqSpEDQdobjqWkf";

function renderSnippet() {
  const opts = {
    apiKey: DEFAULT_WRITE_KEY,
    // note: the page option only covers SSR tracking.
    // Page.js is used to track other events using `window.analytics.page()`
    page: true,
  };
  //
  if (process.env.NODE_ENV === "development") {
    return snippet.max(opts);
  }
  return snippet.min(opts);
}

Router.events.on("routeChangeComplete", (url) => {
  // @ts-ignore
  window.analytics.page(url);
});

Router.events.on("routeChangeStart", (url) => {
  console.log("change route");
  window.alert("helloooo");
  // @ts-ignore
  window.analytics.page(url);
});

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <script
            id={"segment-script"}
            dangerouslySetInnerHTML={{ __html: renderSnippet() }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
