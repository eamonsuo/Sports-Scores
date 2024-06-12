import MatchSummaryList from "@/components/MatchSummaryList";
import { APICALLS, SPORT } from "@/lib/constants";
import { fetchAflData } from "@/api/afl.api";
import React, { ReactNode } from "react";

import ClientSportsPage from "@/components/ClientSportsPage";
import APIStatus from "@/components/ApiStatus";

export default async function Page() {
  const fixtures: MatchSummary[] = await fetchAflData("fixtures");
  const status: APISportsStatus = await fetchAflData("status");

  return (
    <ClientSportsPage
      matches={<MatchSummaryList data={fixtures} />}
      ladder={<div>ladder</div>}
      apiStatus={<APIStatus data={status} />}
    ></ClientSportsPage>
  );
}
