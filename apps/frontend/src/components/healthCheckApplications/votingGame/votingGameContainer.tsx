import { LargeParagraphText } from "../../blocks/text/largeParagraphText";
import { TruncatedTextContainer } from "../../blocks/containers/truncatedTextContainer";
import { BodyText } from "../../blocks/text/bodyText";
import { VotingGame } from "./votingGame";
import {
  selectVotingGame,
  setBaseURL,
  updateLoading,
} from "../../../features/votingGame/votingGameSlice";
import { FailureState } from "../failureState";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useGetAllQuestionsQuery } from "../../../features/votingGame/votingGameAPI";

type VotingGameProps = {
  endpointURL: string;
  shouldPoll: boolean;
};

export const VotingGameContainer = (props: VotingGameProps) => {
  const dispatch = useAppDispatch();

  // Redux Config for the base URL for SQS Game - set at page level for visibility of page config
  useEffect(() => {
    dispatch(setBaseURL(props.endpointURL));
  }, []);

  // When game comes back into view, refetch
  useEffect(() => {
    if (props.shouldPoll) {
      refetch();
    }
  }, [props.shouldPoll]);

  const { isLoading: postedQuestionLoadingState, baseURL } =
    useAppSelector(selectVotingGame);

  const { data, isLoading, error, refetch, fulfilledTimeStamp } =
    useGetAllQuestionsQuery("", {
      skip: baseURL === "", // Wait until the base URL is set
      pollingInterval: props.shouldPoll && 5000,
    });

  // Re-fetch after a vote is cast
  // The delay is a little hacky, but it's a way to not run into cache issues from
  // cloudfront. Because we're doing SWR of 1 second, we want to wait at least a secon
  useEffect(() => {
    if (postedQuestionLoadingState.length > 0 && !isLoading) {
      setTimeout(() => {
        refetch();
      }, 2000);
    }
  }, [postedQuestionLoadingState]);

  // If the loading state is true, set it to false when the data changes
  // Keep in mind, this is only to show the user we are refreshing _after_
  // they have voted, not just when a poll is occurring
  useEffect(() => {
    dispatch(updateLoading({ id: "", loading: false }));
  }, [fulfilledTimeStamp]);

  if (error) {
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
  if (isLoading || !data) {
    return (
      <>
        <LargeParagraphText>
          <span className={"font-bold"}>SQS + EC2 Voting Game</span>
        </LargeParagraphText>
        <div className={"pt-2"}>
          <TruncatedTextContainer>
            <BodyText>
              Only the last 100 votes are tallied. There are no limits to how
              many times you can vote. Go crazy.
            </BodyText>
          </TruncatedTextContainer>
        </div>
        <div className={"flex items-center w-full"}>
          <div className="loader mt-4 mx-auto ease-linear rounded-full border-4 border-t-4 border-neutral-text h-8 w-8" />
        </div>
      </>
    );
  }
  return (
    <>
      <LargeParagraphText>
        <span className={"font-bold"}>SQS + EC2 Voting Game</span>
      </LargeParagraphText>
      <div className={"pt-2"}>
        <TruncatedTextContainer>
          <BodyText>
            Only the last 100 votes are tallied. There are no limits to how many
            times you can vote. Go crazy.
          </BodyText>
        </TruncatedTextContainer>
      </div>
      {data.map((item) => {
        return (
          <div className={"my-8"} key={item.id}>
            <VotingGame {...item} />
          </div>
        );
      })}
    </>
  );
};
