import { LargeParagraphText } from "./blocks/text/largeParagraphText";
import { Question } from "./VotingApp/Question";
import { FailureState } from "./FailureState";
import { useVoteQuestionsQuery } from "./VotingApp/use-vote-questions-query";
import { useVoteSubmitMutation } from "./VotingApp/use-vote-submit-mutation";

type VotingAppProps = {
  endpointURL: string;
  regionURL: string;
};

export const VotingApp = (props: VotingAppProps) => {
  // const dispatch = useAppDispatch();

  // const { isLoading: postedQuestionLoadingState, baseURL } =
  //   useAppSelector(selectVotingGame);

  const { data, status, dataUpdatedAt } = useVoteQuestionsQuery(props.endpointURL, props.regionURL)

  // Re-fetch after a vote is cast
  // The delay is a little hacky, but it's a way to not run into cache issues from
  // cloudfront. Because we're doing SWR of 1 second, we want to wait at least a secon
  // useEffect(() => {
  //   if (postedQuestionLoadingState.length > 0 && !isLoading) {
  //     setTimeout(() => {
  //       refetch();
  //     }, 2000);
  //   }
  // }, [postedQuestionLoadingState]);

  // If the loading state is true, set it to false when the data changes
  // Keep in mind, this is only to show the user we are refreshing _after_
  // they have voted, not just when a poll is occurring
  // useEffect(() => {
  //   dispatch(updateLoading({ id: "", loading: false }));
  // }, [fulfilledTimeStamp]);

  if (status === 'error') {
    return (
      <FailureState>
        <LargeParagraphText>
          <span className={"text-danger text-center block"}>
            {" "}
            The SQS + EC2 + Dynamo DB Voting Game. One of these services might
            be having issues.
          </span>
        </LargeParagraphText>
      </FailureState>
    );
  }

  // !data is necessary here because the "skip" usage in the beginning means both data and isLoading aren't set
  if (status === 'loading') {
    return (
      <div className={"flex items-center w-full"}>
        <div className="loader mt-4 mx-auto ease-linear rounded-full border-4 border-t-4 border-neutral-text h-8 w-8" />
      </div>
    );
  }
  return (
    <>
      {data.map((item) => {
        return (
          <div className={"my-8"} key={item.id}>
            <Question apiURL={props.endpointURL} choices={item.choices ?? []} regionURL={props.regionURL} title={item.title} topicId={item.id} />
          </div>
        );
      })}
    </>
  );
};
