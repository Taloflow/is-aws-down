import { ReactNode, useMemo } from "react"
import { cdnImage } from "~/util/get-image"

type HealthCheckCardHeaderProps = {
    status: 'down' | 'up'
    title: ReactNode
}

export const HealthCheckCardHeader = ({ status, title }: HealthCheckCardHeaderProps) => {
    const icon = useMemo(() => ({
        src: cdnImage(status === 'down' ? '/icons8-fire.gif' : '/icons8-scroll-up.gif'),
        alt: status === 'down' ? 'fire' : 'up arrow'
    }) as const, [status])
    return (
        <>
            <div
                className={
                    "shadow-xl -mt-24 bg-white mx-auto flex items-center max-w-[fit-content] rounded-full p-8"
                }
            >
                <img
                    className={"h-[92px]"}
                    src={icon.src}
                    alt={icon.alt}
                />
            </div>
            <div className={"px-0 xl:px-8 mt-12"}>
                <h1 className='text-2xl sm:text-4xl font-bold text-center block pb-4'>{title}</h1>
            </div>
        </>
    )
}