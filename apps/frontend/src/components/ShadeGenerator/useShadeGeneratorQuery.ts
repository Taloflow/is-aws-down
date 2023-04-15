import { useQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai";
import { visibleSectionAtom } from "../RegionPageObserver";

type UseShadeGeneratorQuery = {
    sectionId: string;
    apiURL: string;
    regionURL: string;
}

export const fetchShade = async (apiURL: string): Promise<string> => {
    const response = await fetch(apiURL)
    return response.json()
}

export const useShadeGeneratorQuery = ({
    sectionId,
    apiURL,
    regionURL,
}: UseShadeGeneratorQuery) => {
    const visibleSection = useAtomValue(visibleSectionAtom)
    return useQuery({
        queryKey: ['regions', regionURL, 'shade'],
        queryFn: () => fetchShade(apiURL),
        enabled: visibleSection === sectionId
    })
}