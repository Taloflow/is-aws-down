import { ReactNode } from "react"
import { LargeParagraphText } from "./blocks/text/largeParagraphText"

type InfoBoxProps = {
    children: ReactNode
}

export const InfoBox = ({ children }: InfoBoxProps) => {
    return (
        <div
            className={
                "rounded-lg bg-success bg-opacity-40 mx-auto max-w-[fit-content] font-bold mb-8 text-[#134606] px-8 py-2 text-2xl"
            }
        >
            <LargeParagraphText>
                {children}
            </LargeParagraphText>
        </div>
    )
}