import { CricketInningIncident } from "@/types/cricket"
import Placeholder from "../misc-ui/Placeholder"

export default function CricketLineups({
  matchIncidents,
}: {
  matchIncidents?: CricketInningIncident[]
}) {
  return (
    <Placeholder>
      {matchIncidents ? "Coming soon" : "No Lineups Available"}
    </Placeholder>
  )
}
