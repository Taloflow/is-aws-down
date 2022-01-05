import { LargeParagraphText } from "../../blocks/text/largeParagraphText";
import { OptionAndVote } from "./optionAndVote";
import {
  QuestionChoice,
  QuestionFromEndpoint,
  selectVotingGame,
} from "../../../features/votingGame/votingGameSlice";
import { Spinner } from "../../blocks/spinner";
import { useAppSelector } from "../../../app/hooks";

export const VotingGame = (props: QuestionFromEndpoint) => {
  const { isLoading } = useAppSelector(selectVotingGame);

  if (!props) {
    return null;
  }

  // The length of the vote column is defined as the percent of the max value
  // if an answer has a vote count of 50 and another is 10, the column will appear
  // as 20% as large as the vote count of 50
  const getVotePercentOfMax = (
    Answers: QuestionChoice[],
    currentValue: number | null
  ): number => {
    if (!currentValue) {
      return 0;
    }
    let answerValues = [] as number[];
    Answers.map((answer) => answerValues.push(answer.votes));
    const maxValue = Math.max.apply(null, answerValues);
    return (currentValue / maxValue) * 100;
  };

  return (
    <div
      className={
        "bg-white rounded-xl shadow-largeCardShadow py-6 overflow-x-hidden relative"
      }
    >
      {isLoading.includes(props.id) && (
        <div className={"absolute flex z-20 right-2 top-2 items-center"}>
          <div className={"!h-4 !w-4 "}>
            <Spinner />
          </div>
        </div>
      )}
      <LargeParagraphText>
        <span className={"text-center block max-w-xl mx-auto"}>
          {props.title}
        </span>
      </LargeParagraphText>
      <div className={"space-y-6 sm:space-y-4 mt-6"}>
        {props?.choices?.map((choice, i) => {
          return (
            <OptionAndVote
              key={choice.id}
              TopicID={props.id}
              id={choice.id}
              votes={choice.votes}
              description={choice.description}
              Index={i}
              IsFinalAnswer={i + 1 === props?.choices?.length}
              VotePercentOfMax={getVotePercentOfMax(
                props.choices,
                choice.votes
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
