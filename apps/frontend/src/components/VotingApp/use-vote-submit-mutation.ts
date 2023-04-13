import { useMutation, useQueryClient } from "@tanstack/react-query";

export type VoteSubmitMutationInput = {
    topicId: string;
    choiceId: string;
}

type VoteSubmitMutationResponse = {
    choice_id: string;
    id: string;
    queued_at: string;
    topic_id: string;
}

const submitVote = async (baseURL: string, input: VoteSubmitMutationInput) => {
    const response = await fetch(`${baseURL}/votes`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({
          topic_id: input.topicId,
          choice_id: input.choiceId,
        }),
    });
    return response.json()
}

export const useVoteSubmitMutation = (baseURL: string, regionURL: string) => {
    const queryClient = useQueryClient()
    return useMutation<
    VoteSubmitMutationResponse,
    unknown,
    VoteSubmitMutationInput
>({
    mutationKey: ['regions', regionURL, 'vote'],
    mutationFn: (input) => submitVote(baseURL, input),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['regions', regionURL, 'votes']})
    }
})
}