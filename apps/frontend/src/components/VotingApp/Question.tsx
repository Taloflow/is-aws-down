import { LargeParagraphText } from "../blocks/text/largeParagraphText";
import { Choice } from "./Choice";
import { useForm } from 'react-hook-form'
import { useRef } from "react";
import { getUUID } from "~/utils";
import { useVoteSubmitMutation, VoteSubmitMutationInput } from "./use-vote-submit-mutation";
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

export const Question = (props: QuestionProps) => {
  const form = useForm<VoteSubmitMutationInput>()
  const submitVoteMutation = useVoteSubmitMutation(props.apiURL, props.regionURL)
  const plusOneContainer = useRef<null | HTMLDivElement>(null);

  // The length of the vote column is defined as the percent of the max value
  // if an answer has a vote count of 50 and another is 10, the column will appear
  // as 20% as large as the vote count of 50
  const getVotePercentOfMax = (
    Answers: VoteAppQuestionChoice[],
    currentValue: number | null
  ): number => {
    if (!currentValue) {
      return 0;
    }
    let answerValues = [] as number[];
    Answers.forEach(answer => {
      if (!answer || typeof answer.votes !== 'number') return;
      answerValues.push(answer.votes)
    });
    const maxValue = Math.max.apply(null, answerValues);
    return (currentValue / maxValue) * 100;
  };

  const triggerPlusOne = () => {
    if (!plusOneContainer.current) {
      return;
    }
    const pNode = document.createElement("p");
    pNode.innerText = "+1";
    pNode.className =
      "absolute text-brand transition-opacity  top-1/2 bottom-1/2 h-full";
    pNode.style.transform = "translate(-50%, -50%)";
    const newID = getUUID().replaceAll("-", "");
    pNode.id = newID;
    plusOneContainer.current.appendChild(pNode);
    setTimeout(() => {
      document.getElementById(newID)?.classList.add("opacity-0");
    }, 100);
    setTimeout(() => {
      document.getElementById(newID)?.remove();
    }, 250);
  };

  const onSubmit = async (data: VoteSubmitMutationInput) => {
    triggerPlusOne()
    await submitVoteMutation.mutateAsync(data)
  }


  return (
    <div
      className={
        "bg-white rounded-xl shadow-largeCardShadow py-6 overflow-x-hidden relative"
      }
    >
      <LargeParagraphText>
        <span className={"text-center block max-w-xl mx-auto"}>
          {props.title}
        </span>
      </LargeParagraphText>
      <form className={"space-y-6 sm:space-y-4 mt-6 divide-x"} onSubmit={form.handleSubmit(onSubmit)}>
        <input type="hidden" {...form.register('topicId')} defaultValue={props.topicId} />
        {props.choices.map((choice, index) => {
          const percentage = getVotePercentOfMax(props.choices, choice.votes)
          return (
            <Choice
              key={choice.id}
              votes={choice.votes ?? 0}
              color={getColor(index)}
              percentage={percentage}
            >
              <div ref={plusOneContainer} className={"relative flex w-4 h-full"}>
                <p className={"opacity-0"}>+1</p>
              </div>
              <button
                type='submit'
                className={
                  "bg-brand-accent sm:mt-4 flex-initial w-[196px] text-center mr-6 h-full text-lg px-6 py-2 text-white rounded-lg"
                }
                value={choice.id}
                {...form.register('choiceId')}
                onClick={triggerPlusOne}
              >

                {choice.description}
              </button>
            </Choice>
          );
        })}
      </form>
    </div>
  );
};
