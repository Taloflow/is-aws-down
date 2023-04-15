import { useQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai";
import { visibleSectionAtom } from "../RegionPageObserver";

type UseQuoteGeneratorQuery = {
    sectionId: string;
    apiURL: string;
    regionURL: string;
}

export const fetchQuote = async (apiURL: string): Promise<string> => {
    const response = await fetch(apiURL)
    return response.json()
}

export const useQuoteGeneratorQuery = ({
    sectionId,
    apiURL,
    regionURL,
}: UseQuoteGeneratorQuery) => {
    const visibleSection = useAtomValue(visibleSectionAtom)
    return useQuery({
        queryKey: ['regions', regionURL, 'quote'],
        queryFn: () => fetchQuote(apiURL),
        enabled: visibleSection === sectionId
    })
}