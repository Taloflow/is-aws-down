import { ReactNode } from "react";
import clsx from 'clsx'
import { LargeParagraphText } from "../blocks/text/largeParagraphText";

type CheckIssueListProps = {
  children?: ReactNode
  title?: ReactNode
}

export const CheckIssueList = ({
  children,
  title,
}: CheckIssueListProps) => {
  return (
    <>
      {title && (
        <LargeParagraphText className={"mt-4"}>
          {title}
        </LargeParagraphText>
      )}
      <ul
        className={clsx(
          "list-disc pl-6 !-mt-0 text-lg sm:text-xl font-medium leading-relaxed"
        )}
      >
        {children}
      </ul>
    </>
  )
}