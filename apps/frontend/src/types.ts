import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

class ErrorMessage {
    Message: string = '';
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}
  
export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

// exports
export {
    ErrorMessage,
};
