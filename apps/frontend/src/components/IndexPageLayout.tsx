import { ReactElement } from "react";
import { SEO } from "./seo";

export const IndexPageLayout = (page: ReactElement) => {
    return (
        <>
            <SEO
                Title={"Is AWS Down? AWS Health Checks And Debugging Steps"}
                Description={"Debug Steps and Monitoring Of 10 Regions "}
            />
            {page}
        </>
    )
}