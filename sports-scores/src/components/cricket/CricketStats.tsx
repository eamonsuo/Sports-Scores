import { CricketInningIncident } from "@/types/cricket"
import Placeholder from "../misc-ui/Placeholder"

export default function CricketStats({
  matchIncidents,
}: {
  matchIncidents?: CricketInningIncident[]
}) {
  return (
    <Placeholder>
      {matchIncidents ? JSON.stringify(matchIncidents) : "No Stats Available"}
    </Placeholder>
  )
}
