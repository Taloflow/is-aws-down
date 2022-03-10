import { useEffect, useRef, useState } from "react";
import {
  QuestionChoice,
  updateLoading,
} from "../../../features/votingGame/votingGameSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getUUID } from "../../../features/utils";

interface OptionAndVoteProps extends QuestionChoice {
  // Calculated fields for UI
  Index: number;
  VotePercentOfMax: number; // Used to calculate how large the option bar is
  IsFinalAnswer: boolean; // useful for if we should display the <hr/> on mobile beneath the question
  TopicID: string; // back end needs to know the topic ID
}

export const OptionAndVote = (props: OptionAndVoteProps) => {
  const dispatch = useAppDispatch();
  const PlusOneContainer = useRef<null | HTMLDivElement>(null);
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
  // Sends vote
  const handleVote = async () => {
    AddPlusOne();
    dispatch(updateLoading({ loading: true, id: props.TopicID }));
    // if (voteValue < 100) {
    //   setVoteValue(voteValue + 1);
    // }
    fetch("https://us-east-1.taloflow.ai/votes", {
      method: "POST",
      headers: [["Content-Type", "application/json"]],
      body: JSON.stringify({
        topic_id: props.TopicID,
        choice_id: props.id,
      }),
    });
  };
  // To handle optimistic UI updates, the actual vote count is kept in local state
  const [voteValue, setVoteValue] = useState(0);
  // Every time we get a new vote value, it replaces the old one
  // This causes some votes to appear discarded, but that is a V2 optimization
  useEffect(() => {
    if (props.votes !== null) {
      setVoteValue(props.votes);
    }
  }, [props.votes]);

  const AddPlusOne = () => {
    if (!PlusOneContainer.current) {
      return;
    }
    const pNode = document.createElement("p");
    pNode.innerText = "+1";
    pNode.className =
      "absolute text-brand transition-opacity  top-1/2 bottom-1/2 h-full";
    pNode.style.transform = "translate(-50%, -50%)";
    const newID = getUUID().replaceAll("-", "");
    pNode.id = newID;
    PlusOneContainer.current.appendChild(pNode);
    setTimeout(() => {
      document.getElementById(newID).classList.add("opacity-0");
    }, 100);
    setTimeout(() => {
      document.getElementById(newID).remove();
    }, 250);
  };

  return (
    <>
      <div className={"flex items-center flex-col sm:flex-row justify-between"}>
        <div className={"flex-1 w-full"}>
          <div
            className={`${getColor(
              props.Index
            )} py-4 pr-4  mr-4 transition-transform will-change-transform rounded-tr-lg rounded-br-lg relative
          `}
            // This is handled with transform so we get buttery smooth animation
            // If the value is zero, show a sliver
            style={{
              transform: `${
                voteValue === 0
                  ? `translate(-99.5%)`
                  : `translate(-${103 - props.VotePercentOfMax}%)`
              }`,
            }}
          >
            <span
              className={`
            ${
              voteValue < 15 ? "text-neutral-text translate-x-12" : "text-white"
            }
             text-right block font-bold text-xl transition transition-transform transition-colors relative
            `}
            >
              {voteValue}{" "}
            </span>
          </div>
        </div>
        <div ref={PlusOneContainer} className={"relative flex w-4 h-full"}>
          <p className={"opacity-0"}>+1</p>
        </div>
        <button
          onClick={() => handleVote()}
          className={
            "bg-brand-accent sm:mt-0 sm:mt-4 flex-initial w-[196px] text-center mr-6 h-full text-lg px-6 py-2 text-white rounded-lg"
          }
        >
          {props.description}
        </button>
      </div>
      {!props.IsFinalAnswer && (
        <hr
          className={
            "bg-neutral-light color-neutral-light border-neutral-light h-2 sm:hidden"
          }
        />
      )}
    </>
  );
};
