import type { ReactElement } from "react";
import { Provider } from 'jotai'
import { RegionPageObserver } from "./RegionPageObserver";
import { RegionNavbar } from "./RegionNavbar";

export const RegionPageLayout = (page: ReactElement) => {
    return (
        <Provider>
            <RegionPageObserver>
                <RegionNavbar />
                {page}
            </RegionPageObserver>
        </Provider>
    )
}