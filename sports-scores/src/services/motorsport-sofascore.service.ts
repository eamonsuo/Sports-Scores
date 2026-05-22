import {
  fetchMotorsportStageStandings,
  fetchMotorsportSubstages,
} from "@/endpoints/motorsport.api"
import { MOTORSPORT_CATEGORIES } from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { CardVariant, SPORT } from "@/types/misc"
import { SofascoreStageSport } from "./sofascore.service"

class MotorsportSofascoreService extends SofascoreStageSport {
  constructor() {
    super(
      {
        fetchStageRaces: withDevCache(
          "motorsport",
          "stage-races",
          fetchMotorsportSubstages,
        ),
        fetchStageStandings: withDevCache(
          "motorsport",
          "stage-standings",
          fetchMotorsportStageStandings,
        ),
      },
      SPORT.MOTORSPORT,
      MOTORSPORT_CATEGORIES,
      CardVariant.SESSION,
    )
  }
}

export const motorsportSofascoreService = new MotorsportSofascoreService()
