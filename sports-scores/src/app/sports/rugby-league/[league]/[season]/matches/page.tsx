"use client";
import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import Placeholder from "@/components/misc-ui/Placeholder";
import { rugbyLeagueMatches } from "@/services/rugby-league.service";
import { RugbyLeagueFixturesPage } from "@/types/rugby-league";
import { use, useEffect, useState } from "react";

export default function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = use(props.params);
  const [pageData, setPageData] = useState<RugbyLeagueFixturesPage | null>(
    null,
  );

  useEffect(() => {
    rugbyLeagueMatches(Number(league), Number(season)).then((res) =>
      setPageData(res),
    );
  }, [league, season]);

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <FixtureRoundList
      data={pageData.fixtures}
      curRound={pageData.currentRound}
    />
  );
}
