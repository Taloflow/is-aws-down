import type { ReactElement } from "react";
import { Provider } from 'jotai'
import { RegionPageObserver } from "./RegionPageObserver";
import { RegionNavbar } from "./RegionNavbar";
import { Footer } from "./general/legalFooter";

export const RegionPageLayout = (page: ReactElement) => {
    return (
        <Provider>
            <RegionPageObserver>
                <RegionNavbar />
                    {page}
                <Footer />
            </RegionPageObserver>
        </Provider>
    )
}