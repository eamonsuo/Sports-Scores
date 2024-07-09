import {
  fetchF1DriverStandings,
  fetchF1Races,
  fetchF1Status,
  fetchF1TeamStandings,
} from "@/api/f1.api";
import F1DriverStandings from "@/components/f1/F1DriverStandings";
import F1TeamStandings from "@/components/f1/F1TeamStandings";
import RaceList from "@/components/f1/RaceList";
import ClientSportsPage from "@/components/generic/ClientSportsPage";
import APIStatus from "@/components/ui/ApiStatus";
import { mapF1SessionFields } from "@/lib/dataMapping";

export default async function Page() {
  const status = await fetchF1Status();
  const rawRaces = await fetchF1Races(2024);
  const races = mapF1SessionFields(rawRaces);

  const driverStandings = await fetchF1DriverStandings(2024);
  const teamStandings = await fetchF1TeamStandings(2024);

  const pageOptions = [
    {
      btnLabel: "Races",
      component: <RaceList data={races} />,
      state: "matches",
    },
    {
      btnLabel: "Driver Standings",
      component: <F1DriverStandings data={driverStandings} />,
      state: "drivers",
    },
    {
      btnLabel: "Team Standings",
      component: <F1TeamStandings data={teamStandings} />,
      state: "teams",
    },
  ];

  return (
    <ClientSportsPage
      options={pageOptions}
      apiStatus={<APIStatus data={status} />}
    />
  );
}
