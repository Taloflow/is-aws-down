import Document, { Html, Head, Main, NextScript } from "next/document";
import * as snippet from "@segment/snippet";
import { Router } from "next/router";

const DEFAULT_WRITE_KEY = "pXZJ3AzXJmrxGPRiWNqSpEDQdobjqWkf";

function renderSnippet() {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-NSCHQZH')`;
}

Router.events.on("routeChangeComplete", (url) => {
  // @ts-ignore
  window.analytics.page(url);
});


// @ts-ignore - No idea why I'm getting an error for this
export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <script
            id={"google-tag-manager-script"}
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
