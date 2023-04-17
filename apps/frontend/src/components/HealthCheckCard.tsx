import type { ReactNode } from "react"
import { StandardCard } from "./blocks/containers/standardCard"
import { HealthCheckCardHeader } from "./HealthCheckCard/Header"

type HealthCheckCardProps = {
    status: 'down' | 'up'
    title: ReactNode
    children?: ReactNode
}

export const HealthCheckCard = ({ children, status, title }: HealthCheckCardProps) => {
    return (
        <StandardCard>
            <HealthCheckCardHeader
                status={status}
                title={title}
            />
            {children}
        </StandardCard>
    )
}