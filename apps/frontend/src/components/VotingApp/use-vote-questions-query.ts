import { useQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { visibleSectionAtom } from "../RegionPageObserver"

export type VoteAppQuestion = {
    is_active: boolean;
    id: string;
    title: string;
    choices: VoteAppQuestionChoice[];
    endpointURL: string;
}

export type VoteAppQuestionChoice = {
    id: string;
    votes: number | null;
    description: string;
}

export const fetchVoteQuestionsQuery = async ({ baseURL }: { baseURL: string }) => {
    const response = await fetch(`${baseURL}/topics?include_votes=true`)
    return response.json()
}

export const useVoteQuestionsQuery = (baseURL: string, regionURL: string) => {
    const visibleSection = useAtomValue(visibleSectionAtom)
    return useQuery<VoteAppQuestion[]>({
        queryKey: ['regions', regionURL, 'votes'],
        queryFn: () => fetchVoteQuestionsQuery({ baseURL }),
        refetchInterval: visibleSection === 'is-sqs-down' ? 5000 : false,
    })
}