import { LargeParagraphText } from "../blocks/text/largeParagraphText";
import { Choice } from "./Choice";
import { useCallback, useMemo, useRef } from "react";
import { getUUID } from "~/utils";
import { useVoteSubmitMutation } from "./use-vote-submit-mutation";
import { VoteAppQuestionChoice } from "./use-vote-questions-query";

const availableColors = [
  "bg-[#FCBF64]",
  "bg-[#6EC5EB]",
  "bg-[#B66EE2]",
  "bg-[#6EE2C7]",
  "bg-[#E26EA6]",
  "bg-[#646AFC]",
  "bg-[#E764FC]",
  "bg-[#FC6491]",
  "bg-[#64FC7C]",
  "bg-[#56E13F]",
  "bg-[#3FC4E1]",
  "bg-[#3F76E1]",
];

const getColor = (index: number): string => {
  if (index === 0) {
    return "bg-[#FCBF64]";
  }
  if (index === 1) {
    return "bg-[#6EC5EB]";
  }
  if (index === 2) {
    return "bg-[#B66EE2]";
  }
  if (index === 3) {
    return "bg-[#E26EA6]";
  }
  if (index === 4) {
    return "bg-[#6EE2C7]";
  }
  return "bg-[#FCBF64]";
};

type QuestionProps = {
  choices: VoteAppQuestionChoice[];
  topicId: string;
  title: string;
  regionURL: string;
  apiURL: string;
}

const getChoicesVotes = (choices: VoteAppQuestionChoice[]) => {
  const votes: number[] = []
  for (let choice of choices) {
    if (typeof choice.votes !== 'number') continue;
    votes.push(choice.votes)
  }
  return votes
}

export const Question = ({ apiURL, choices, regionURL, title, topicId }: QuestionProps) => {
  const submitVoteMutation = useVoteSubmitMutation(apiURL, regionURL)
  const plusOneContainersRef = useRef<Record<string, HTMLDivElement>>({});

  // The length of the vote column is defined as the percent of the max value
  // if an answer has a vote count of 50 and another is 10, the column will appear
  // as 20% as large as the vote count of 50
  const votePercentagesOfMax = useMemo(() => {
    const choicesVotes = getChoicesVotes(choices)
    const maxValue = Math.max(...choicesVotes)
    const percentages: Record<string, number> = {}
    for (let choice of choices) {
      const votes = choice.votes ?? 0
      const percentage = (votes / maxValue) * 100
      percentages[choice.id] = isNaN(percentage) ? 0 : percentage
    }
    return percentages
  }, [choices])


  const triggerPlusOne = useCallback((choiceId: string) => {
    const choices = plusOneContainersRef.current
    if (!choices) {
      return undefined;
    }
    const choiceContainer = choices[choiceId]
    if (!choiceContainer) {
      return undefined;
    }
    const pNode = document.createElement("p");
    pNode.innerText = "+1";
    pNode.className =
      "absolute text-brand transition-opacity  top-1/2 bottom-1/2 h-full";
    pNode.style.transform = "translate(-50%, -50%)";
    const newID = getUUID().replaceAll("-", "");
    pNode.id = newID;
    choiceContainer.appendChild(pNode);
    setTimeout(() => {
      document.getElementById(newID)?.classList.add("opacity-0");
    }, 100);
    setTimeout(() => {
      document.getElementById(newID)?.remove();
    }, 250);
  }, []);

  const handleVote = useCallback((choiceId: string) => async () => {
    triggerPlusOne(choiceId)
    await submitVoteMutation.mutateAsync({ topicId: topicId, choiceId })
  }, [topicId])

  const handlePlusContainerMount = (choiceId: string) => (el: HTMLDivElement) => {
    plusOneContainersRef.current[choiceId] = el;
  }


  return (
    <div
      className={
        "bg-white rounded-xl shadow-largeCardShadow py-6 overflow-x-hidden relative"
      }
    >
      <LargeParagraphText>
        <span className={"text-center block max-w-xl mx-auto"}>
          {title}
        </span>
      </LargeParagraphText>
      <div className={"space-y-6 sm:space-y-4 mt-6 divide-x"}>
        {choices.map((choice, index) => {
          const percentage = votePercentagesOfMax[choice.id]
          return (
            <Choice
              key={choice.id}
              votes={choice.votes ?? 0}
              color={getColor(index)}
              percentage={percentage}
            >
              <div ref={handlePlusContainerMount(choice.id)} className={"relative flex w-4 h-full"}>
                <p className={"opacity-0"}>+1</p>
              </div>
              <button
                type='button'
                className={
                  "bg-brand-accent sm:mt-4 flex-initial w-[196px] text-center mr-6 h-full text-lg px-6 py-2 text-white rounded-lg"
                }
                onClick={handleVote(choice.id)}
              >

                {choice.description}
              </button>
            </Choice>
          );
        })}
      </div>
    </div>
  );
};
