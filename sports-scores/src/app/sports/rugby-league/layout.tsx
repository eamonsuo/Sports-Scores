import LeagueSeasonToggle from "@/components/generic/LeagueSeasonToggle";
import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";

export const RUGBY_LEAGUE_LEAGUES = [
  {
    name: "NRL",
    slug: "294",
    seasons: [
      { name: "2025", slug: "69277" },
      { name: "2024", slug: "56749" },
      { name: "2023", slug: "47382" },
      { name: "2022", slug: "39630" },
      { name: "2021", slug: "34941" },
      { name: "2020", slug: "26032" },
      { name: "2019", slug: "19487" },
      { name: "2018", slug: "15699" },
      { name: "2017", slug: "12722" },
      { name: "2016", slug: "11327" },
      { name: "2015", slug: "9762" },
      { name: "2014", slug: "7520" },
      { name: "2013", slug: "5709" },
      { name: "2012", slug: "4092" },
      { name: "2011", slug: "3178" },
      { name: "2010", slug: "2597" },
      { name: "2009", slug: "1974" },
      { name: "2008", slug: "1153" },
      { name: "2007", slug: "42987" },
    ],
  },
  {
    name: "NRLW",
    slug: "19120",
    seasons: [
      { name: "2025", slug: "69964" },
      { name: "2024", slug: "56809" },
      { name: "2023", slug: "51393" },
    ],
  },
  {
    name: "State of Origin",
    slug: "791",
    seasons: [
      { name: "2025", slug: "69960" },
      { name: "2024", slug: "56900" },
      { name: "2023", slug: "48134" },
      { name: "2022", slug: "40148" },
      { name: "2021", slug: "36264" },
      { name: "2020", slug: "26553" },
      { name: "2019", slug: "20098" },
      { name: "2018", slug: "15779" },
      { name: "2017", slug: "13138" },
      { name: "2016", slug: "11628" },
      { name: "2015", slug: "10281" },
      { name: "2014", slug: "8060" },
      { name: "2013", slug: "5705" },
      { name: "2012", slug: "4536" },
      { name: "2011", slug: "3321" },
      { name: "2010", slug: "2715" },
    ],
  },
  {
    name: "Queensland Cup",
    slug: "2135",
    seasons: [
      { name: "2025", slug: "69961" },
      { name: "2024", slug: "57514" },
      { name: "2023", slug: "48145" },
      { name: "2022", slug: "40184" },
      { name: "2021", slug: "35084" },
      { name: "2020", slug: "26865" },
      { name: "2019", slug: "22828" },
      { name: "2018", slug: "16174" },
      { name: "2017", slug: "12981" },
      { name: "2016", slug: "11366" },
      { name: "2015", slug: "10176" },
    ],
  },
  {
    name: "New South Wales Cup",
    slug: "2134",
    seasons: [
      { name: "2025", slug: "69962" },
      { name: "2024", slug: "57568" },
    ],
  },
  {
    name: "World Cup",
    slug: "431",
    seasons: [{ name: "2021", slug: "42989" }],
  },
  {
    name: "World Cup - Women",
    slug: "10683",
    seasons: [{ name: "2022", slug: "42991" }],
  },
  {
    name: "Pacific Championship",
    slug: "13667",
    seasons: [{ name: "2024", slug: "66664" }],
  },
  {
    name: "Pacific Championship - Women",
    slug: "21300",
    seasons: [{ name: "2024", slug: "66683" }],
  },
  {
    name: "Int. Friendly Games",
    slug: "977",
    seasons: [{ name: "2025", slug: "69571" }],
  },
  {
    name: "World Club Challenge",
    slug: "1590",
    seasons: [{ name: "2024", slug: "57112" }],
  },
  {
    name: "Super League",
    slug: "302",
    seasons: [
      { name: "2025", slug: "69930" },
      { name: "2024", slug: "57044" },
    ],
  },
];

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.RUGBY_LEAGUE);

  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle
        sport={SPORT.RUGBY_LEAGUE}
        leagues={RUGBY_LEAGUE_LEAGUES}
      />
      <NavButtonGroup
        buttons={[
          {
            href: "./matches",
            label: "Matches",
            page: "matches",
          },
          {
            href: "./ladder",
            label: "Ladder",
            page: "ladder",
          },
        ]}
      />
      {children}
      <APIStatus status={quota?.percentUsed ?? "N/A"} reset="per day" />
    </div>
  );
}
