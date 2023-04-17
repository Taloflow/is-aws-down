import Link from "next/link"
import { useMemo } from "react"
import { LocationSummary } from "~/hooks/use-aws-status-overview"
import { useStatusOverviewIssues } from "~/hooks/use-status-overview-issues"
import { serviceListNames } from "~/utils/service-list"
import { StandardCard } from "./blocks/containers/standardCard"
import { LargeParagraphText } from "./blocks/text/largeParagraphText"
import { HealthCheckCard } from "./HealthCheckCard"
import { CheckIssueList } from "./HealthCheckCard/CheckIssueList"
import { InfoBox } from "./InfoBox"
import { ServiceList } from "./ServiceList"

type StatusOverviewCardProps = {
  data: LocationSummary[]
}

const statusTitle = {
  down: 'Some AWS services have had issues in the last day',
  up: 'Our health check show AWS is up!'
} as const

export const StatusOverviewCard = ({ data }: StatusOverviewCardProps) => {
  const { lastDay, lastHour, downRegions } = useStatusOverviewIssues(data)
  const status = useMemo(() => lastDay.size > 0 ? 'down' : 'up', [lastDay])
  const title = useMemo(() => statusTitle[status], [status])
  const hadIssues = useMemo(() => lastHour.size > 0 || lastDay.size > 0, [lastDay, lastHour])

  return (
    <>
      <HealthCheckCard
        title={title}
        status={status}
      >
        {!hadIssues && (
          <InfoBox>
            Our health checks returned no errors in the last day
          </InfoBox>
        )}
        {downRegions.size > 0 && (
          <CheckIssueList
            title='These regions have had failures in the last day:'
          >
            {Array.from(downRegions).map(region => <li key={region}>{region}</li>)}
          </CheckIssueList>
        )}
        {lastHour.size > 0 && (
          <CheckIssueList
            title='These services have had failures in the last hour:'
          >
            {Array.from(lastHour).map(service => <li key={service}>{service}</li>)}
          </CheckIssueList>
        )}
        {lastDay.size > 0 && (
          <CheckIssueList
            title='These services have had failures in the last day:'
          >
            {Array.from(lastDay).map(service => <li key={service}>{service}</li>)}
          </CheckIssueList>
        )}
      </HealthCheckCard>
    </>
  )
}