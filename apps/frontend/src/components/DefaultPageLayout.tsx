import { ReactElement } from "react";
import { Footer } from "./general/legalFooter";

export const DefaultPageLayout = (page: ReactElement) => (
    <>
        {page}
        <Footer />
    </>
)