import { CountryFlagCode } from "@/types/misc";
import { getCountryImageUrl } from "./projUtils";

const fallback = "/vercel.svg";

export function resolveSportImage(teamName: string) {
  switch (teamName) {
    // LIV Teams
    case "4ACES GC":
    case "4Aces GC":
      return "/liv/4aces.webp";
    case "LEGION XIII":
    case "Legion XIII":
      return "/liv/legion13.webp";
    case "CRUSHERS GC":
    case "Crushers GC":
      return "/liv/crushers.webp";
    case "STINGER GC":
      return "/liv/stinger.webp";
    case "FIREBALLS GC":
    case "Fireballs GC":
      return "/liv/fireballs.webp";
    case "CLEEKS GOLF CLUB":
    case "Cleeks Golf Club":
      return "/liv/cleeks.webp";
    case "TORQUE GC":
    case "Torque GC":
      return "/liv/torque.webp";
    case "RIPPER GC":
    case "Ripper GC":
      return "/liv/ripper.webp";
    case "HYFLYERS GC":
    case "HyFlyers GC":
      return "/liv/hyflyers.webp";
    case "MAJESTICKS GC":
      return "/liv/majesticks.webp";
    case "Majesticks Golf Club":
      return fallback;
    case "RANGEGOATS GC":
    case "RangeGoats GC":
      return "/liv/rangegoats.webp";
    case "SMASH GC":
    case "Smash GC":
      return "/liv/smash.webp";
    case "IRON HEADS GC":
      return "/liv/ironheads.webp";
    case "Korean Golf Club":
      return fallback;
    case "Southern Guards GC":
      return fallback;

    //NRL
    case "Brisbane Broncos":
      return "/nrl/broncos.svg";
    case "Canberra Raiders":
      return "/nrl/raiders.svg";
    case "Canterbury Bulldogs":
      return "/nrl/bulldogs.svg";
    case "Cronulla Sharks":
      return "/nrl/sharks.svg";
    case "Dolphins":
      return "/nrl/dolphins.svg";
    case "Gold Coast Titans":
      return "/nrl/titans.svg";
    case "Manly Sea Eagles":
      return "/nrl/eagles.svg";
    case "Melbourne Storm":
      return "/nrl/storm.svg";
    case "Newcastle Knights":
      return "/nrl/knights.svg";
    case "New Zealand Warriors":
      return "/nrl/warriors.svg";
    case "North Queensland Cowboys":
      return "/nrl/cowboys.svg";
    case "Parramatta Eels":
      return "/nrl/eels.svg";
    case "Penrith Panthers":
      return "/nrl/panthers.svg";
    case "South Sydney Rabbitohs":
      return "/nrl/rabbitohs.svg";
    case "St. George Illawarra Dragons":
      return "/nrl/dragons.svg";
    case "Sydney Roosters":
      return "/nrl/roosters.svg";
    case "Wests Tigers":
      return "/nrl/tigers.svg";
    case "Queensland Maroons":
      return "https://upload.wikimedia.org/wikipedia/commons/d/d1/State_of_Origin_QLD_Maroons_Logo.jpg";
    case "New South Wales Blues":
      return "https://upload.wikimedia.org/wikipedia/en/8/80/NSW_Blues_Logo_2023.png";

    //AFL
    case "Adelaide Crows":
      return "/afl/crows.svg";
    case "Brisbane Lions":
    case "Brisbane Lions II":
      return "/afl/lions.svg";
    case "Carlton Blues":
    case "Carlton Blues II":
      return "/afl/blues.svg";
    case "Collingwood Magpies":
    case "Collingwood Magpies II":
      return "/afl/magpies.svg";
    case "Essendon Bombers":
    case "Essendon Bombers II":
      return "/afl/bombers.svg";
    case "Fremantle Dockers":
      return "/afl/dockers.svg";
    case "Geelong Cats":
    case "Geelong Cats II":
      return "/afl/cats.svg";
    case "Gold Coast Suns":
    case "Gold Coast Suns II":
      return "/afl/suns.svg";
    case "GWS Giants":
    case "GWS Giants II":
      return "/afl/giants.svg";
    case "Hawthorn Hawks":
      return "/afl/hawks.svg";
    case "Melbourne Demons":
      return "/afl/demons.svg";
    case "North Melbourne":
    case "North Melbourne Kangaroos II":
      return "/afl/kangaroos.svg";
    case "Port Adelaide Power":
      return "/afl/power.svg";
    case "Richmond Tigers":
    case "Richmond Tigers II":
      return "/afl/tigers.svg";
    case "St Kilda Saints":
      return "/afl/saints.svg";
    case "Sydney Swans":
      return "/afl/swans.svg";
    case "West Coast Eagles":
      return "/afl/eagles.svg";
    case "Western Bulldogs":
      return "/afl/bulldogs.svg";

    //NFL
    case "Arizona Cardinals":
      return "/nfl/cardinals.svg";
    case "Atlanta Falcons":
      return "/nfl/falcons.svg";
    case "Baltimore Ravens":
      return "/nfl/ravens.svg";
    case "Buffalo Bills":
      return "/nfl/bills.svg";
    case "Carolina Panthers":
      return "/nfl/panthers.svg";
    case "Chicago Bears":
      return "/nfl/bears.svg";
    case "Cincinnati Bengals":
      return "/nfl/bengals.svg";
    case "Cleveland Browns":
      return "/nfl/browns.svg";
    case "Dallas Cowboys":
      return "/nfl/cowboys.svg";
    case "Denver Broncos":
      return "/nfl/broncos.svg";
    case "Detroit Lions":
      return "/nfl/lions.svg";
    case "Green Bay Packers":
      return "/nfl/packers.svg";
    case "Houston Texans":
      return "/nfl/texans.svg";
    case "Indianapolis Colts":
      return "/nfl/colts.svg";
    case "Jacksonville Jaguars":
      return "/nfl/jaguars.svg";
    case "Kansas City Chiefs":
      return "/nfl/chiefs.svg";
    case "Las Vegas Raiders":
      return "/nfl/raiders.svg";
    case "Los Angeles Chargers":
      return "/nfl/chargers.svg";
    case "Los Angeles Rams":
      return "/nfl/rams.svg";
    case "Miami Dolphins":
      return "/nfl/dolphins.svg";
    case "Minnesota Vikings":
      return "/nfl/vikings.svg";
    case "New England Patriots":
      return "/nfl/patriots.svg";
    case "New Orleans Saints":
      return "/nfl/saints.svg";
    case "New York Giants":
      return "/nfl/giants.svg";
    case "New York Jets":
      return "/nfl/jets.svg";
    case "Philadelphia Eagles":
      return "/nfl/eagles.svg";
    case "Pittsburgh Steelers":
      return "/nfl/steelers.svg";
    case "San Francisco 49ers":
      return "/nfl/49ers.svg";
    case "Seattle Seahawks":
      return "/nfl/seahawks.svg";
    case "Tampa Bay Buccaneers":
      return "/nfl/buccaneers.svg";
    case "Tennessee Titans":
      return "/nfl/titans.svg";
    case "Washington Commanders":
      return "/nfl/commanders.svg";

    // F1
    case "Red Bull":
      return "/f1/redbull-f1.svg";
    case "Mercedes":
      return "/f1/mercedes-benz.svg";
    case "Ferrari":
      return "/f1/ferrari-f1.svg";
    case "McLaren":
      return "/f1/mclaren.png";
    case "Alpine F1 Team":
      return "/f1/alpine.png";
    case "Aston Martin":
      return "/f1/astonmartin.svg";
    case "RB F1 Team":
    case "Racing Bulls":
      return "/f1/racing-bulls-f1.svg";
    case "Sauber":
      return "/f1/sauber.webp";
    case "Haas F1 Team":
      return "/f1/haas.png";
    case "Williams":
      return "/f1/williams-f1.svg";
    case "Audi":
      return "https://upload.wikimedia.org/wikipedia/commons/0/03/Audif1.com_logo17_%28cropped%29.svg";
    case "Cadillac":
      return "https://upload.wikimedia.org/wikipedia/en/b/bc/Cadillac_Formula_1_Team_Logo_%282025%29.svg";

    //Cricket
    case "Queensland":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/1205@2x.png";
    case "Queensland Fire":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/89@2x.png";
    case "New South Wales":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/674@2x.png";
    case "New South Wales Breakers":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/90@2x.png";
    case "Tasmania":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/85@2x.png";
    case "Victoria":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/82@2x.png";
    case "South Australia":
    case "South Australian Scorpions":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/1214@2x.png";
    case "ACT Meteors":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/92@2x.png";
    case "Western Australia":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/83@2x.png";
    case "Brisbane Heat":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/100@2x.png";
    case "Melbourne Stars":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/97@2x.png";
    case "Melbourne Renegades":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/101@2x.png";
    case "Sydney Sixers":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/98@2x.png";
    case "Sydney Thunder":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/102@2x.png";
    case "Hobart Hurricanes":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/96@2x.png";
    case "Adelaide Strikers":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/99@2x.png";
    case "Perth Scorchers":
      return "https://static-files.cricket-australia.pulselive.com/flag/120/95@2x.png";

    // Football
    // A Leagues
    case "Brisbane Roar":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/5326.png";
    case "Newcastle Jets":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/5323.png";
    case "Macarthur FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19340.png";
    case "Sydney FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/5327.png";
    case "Auckland FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/22344.png";
    case "Adelaide United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/5321.png";
    case "Melbourne Victory":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/5328.png";
    case "Melbourne City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/11143.png";
    case "Wellington Phoenix":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/8352.png";
    case "Central Coast Mariners":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/5325.png";
    case "Western Sydney Wanderers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/13696.png";
    case "Perth Glory":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/5322.png";
    case "Canberra United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/5321.png";

    // EPL
    case "Arsenal":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/359.png";
    case "Manchester City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/382.png";
    case "Manchester United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/360.png";
    case "Chelsea":
    case "Chelsea FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/363.png";
    case "Liverpool":
    case "Liverpool FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/364.png";
    case "Tottenham Hotspur":
    case "Tottenham FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/367.png";
    case "Everton":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/368.png";
    case "West Ham United":
    case "West Ham":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/371.png";
    case "Leicester City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/375.png";
    case "Leeds United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/357.png";
    case "Southampton":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/376.png";
    case "Newcastle United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/361.png";
    case "Wolverhampton Wanderers":
    case "Wolverhampton":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/380.png";
    case "Aston Villa":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/362.png";
    case "Crystal Palace":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/384.png";
    case " Brighton & Hove Albion":
    case "Brighton":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/331.png";
    case "Burnley":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/379.png";
    case "Norwich City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/381.png";
    case "Fulham":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/370.png";
    case "Sheffield United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/398.png";
    case "Huddersfield Town":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/377.png";
    case "West Bromwich Albion":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/383.png";
    case "Nottingham Forest":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/393.png";
    case "Brighton & Hove Albion":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/331.png";
    case "Bournemouth":
    case "AFC Bournemouth":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/349.png";
    case "Brentford":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/337.png";
    case "Sunderland":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/366.png";
    case "Ipswich Town":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/373.png";
    case "London City Lionesses":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/21053.png";

    // Championship
    case "Birmingham City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/392.png";
    case "Blackburn Rovers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/365.png";
    case "Bristol City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/333.png";
    case "Charlton Athletic":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/372.png";
    case "Coventry City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/388.png";
    case "Derby County":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/374.png";
    case "Hull City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/306.png";
    case "Middlesbrough":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/369.png";
    case "Millwall":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/391.png";
    case "Oxford United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/311.png";
    case "Portsmouth":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/385.png";
    case "Preston North End":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/394.png";
    case "Queens Park Rangers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/334.png";
    case "Sheffield Wednesday":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/399.png";
    case "Stoke City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/336.png";
    case "Swansea City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/318.png";
    case "Watford":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/395.png";
    case "Wrexham":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/352.png";

    // League One
    case "AFC Wimbledon":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3802.png";
    case "Barnsley":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/397.png";
    case "Blackpool":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/346.png";
    case "Bolton Wanderers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/358.png";
    case "Bradford City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/387.png";
    case "Burton Albion":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2567.png";
    case "Cardiff City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/347.png";
    case "Doncaster Rovers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/279.png";
    case "Exeter City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/324.png";
    case "Leyton Orient":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/309.png";
    case "Lincoln City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/314.png";
    case "Luton Town":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/301.png";
    case "Mansfield Town":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/304.png";
    case "Northampton Town":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/353.png";
    case "Peterborough United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/342.png";
    case "Plymouth Argyle":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/307.png";
    case "Port Vale":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/348.png";
    case "Reading":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/338.png";
    case "Rotherham United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/402.png";
    case "Stevenage":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/285.png";
    case "Stockport County":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/400.png";
    case "Wigan Athletic":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/350.png";
    case "Wycombe Wanderers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/344.png";

    // Ligue 1
    case "Paris Saint-Germain":
    case "Paris SG":
    case "PSG":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/160.png";
    case "Olympique de Marseille":
    case "Marseille":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/176.png";
    case "Olympique Lyonnais":
    case "Lyon":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/167.png";
    case "AS Monaco":
      // case "Monaco":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/174.png";
    case "Lille OSC":
    case "Lille":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/166.png";
    case "Stade Rennais":
    case "Rennes":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/169.png";
    case "OGC Nice":
    case "Nice":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2502.png";
    case "RC Lens":
    case "Lens":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/165.png";
    case "RC Strasbourg":
    case "Strasbourg":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/180.png";
    case "Stade Brestois":
    case "Brest":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/6997.png";
    case "Stade de Reims":
    case "Reims":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3243.png";
    case "Montpellier HSC":
    case "Montpellier":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3243.png";
    case "FC Nantes":
    case "Nantes":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/165.png";
    case "Angers SCO":
    case "Angers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3240.png";
    case "Toulouse FC":
    case "Toulouse":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/173.png";
    case "AJ Auxerre":
    case "Auxerre":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/172.png";
    case "Le Havre AC":
    case "Le Havre":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3236.png";
    case "AS Saint-Étienne":
    case "Saint-Étienne":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/178.png";
    case "Lorient":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/273.png";
    case "Metz":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/177.png";
    case "Paris FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/6851.png";

    // Bundesliga
    case "1. FC Heidenheim 1846":
    case "1. FC Heidenheim":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/6418.png";
    case "1. FC Union Berlin":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/598.png";
    case "Bayer Leverkusen":
    case "Bayer 04 Leverkusen":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/131.png";
    case "Bayern Munich":
    case "FC Bayern München":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/132.png";
    case "Borussia Dortmund":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/124.png";
    case "Borussia Mönchengladbach":
    case "Borussia M'gladbach":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/268.png";
    case "Eintracht Frankfurt":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/125.png";
    case "FC Augsburg":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3841.png";
    case "FC Cologne":
    case "1. FC Köln":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/122.png";
    case "Hamburg SV":
    case "Hamburger SV":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/127.png";
    case "Mainz":
    case "1. FSV Mainz 05":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2950.png";
    case "RB Leipzig":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/11420.png";
    case "SC Freiburg":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/126.png";
    case "St. Pauli":
    case "FC St. Pauli":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/270.png";
    case "TSG Hoffenheim":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/7911.png";
    case "VfB Stuttgart":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/134.png";
    case "VfL Wolfsburg":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/138.png";
    case "Werder Bremen":
    case "SV Werder Bremen":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/137.png";

    // Serie A
    case "AC Milan":
    case "Milan":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/103.png";
    case "AS Roma":
    case "Roma":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/104.png";
    case "Atalanta":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/105.png";
    case "Bologna":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/107.png";
    case "Cagliari":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2925.png";
    case "Como":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2572.png";
    case "Cremonese":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/4050.png";
    case "Fiorentina":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/109.png";
    case "Genoa":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3263.png";
    case "Hellas Verona":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/119.png";
    case "Internazionale":
    case "Inter Milan":
    case "Inter":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/110.png";
    case "Juventus":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/111.png";
    case "Lazio":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/112.png";
    case "Lecce":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/113.png";
    case "Napoli":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/114.png";
    case "Parma":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/115.png";
    case "Pisa":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3956.png";
    case "Sassuolo":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3997.png";
    case "Torino":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/239.png";
    case "Udinese":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/118.png";

    // La Liga
    case "Alavés":
    case "Deportivo Alavés":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/96.png";
    case "Athletic Club":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/93.png";
    case "Atlético Madrid":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/1068.png";
    case "Barcelona":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/83.png";
    case "Celta Vigo":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/85.png";
    case "Elche":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3751.png";
    case "Espanyol":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/88.png";
    case "Getafe":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2922.png";
    case "Girona":
    case "Girona FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9812.png";
    case "Levante":
    case "Levante UD":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/1538.png";
    case "Mallorca":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/84.png";
    case "Osasuna":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/97.png";
    case "Rayo Vallecano":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/101.png";
    case "Real Betis":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/244.png";
    case "Real Madrid":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/86.png";
    case "Real Oviedo":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/92.png";
    case "Real Sociedad":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/89.png";
    case "Sevilla":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/243.png";
    case "Valencia":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/94.png";
    case "Villarreal":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/102.png";

    // MLS
    case "Atlanta United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18418.png";
    case "Austin FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/20906.png";
    case "CF Montréal":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9720.png";
    case "Charlotte FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/21300.png";
    case "Chicago Fire FC":
    case "Chicago Fire":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/182.png";
    case "Colorado Rapids":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/184.png";
    case "Columbus Crew":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/183.png";
    case "DC United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/193.png";
    case "FC Cincinnati":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18267.png";
    case "FC Dallas":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/185.png";
    case "Houston Dynamo FC":
    case "Houston Dynamo":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/6077.png";
    case "Inter Miami CF":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/20232.png";
    case "LA Galaxy":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/187.png";
    case "LAFC":
    case "Los Angeles FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18966.png";
    case "Minnesota United FC":
    case "Minnesota United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17362.png";
    case "Nashville SC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18986.png";
    case "New England Revolution":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/189.png";
    case "New York City FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17606.png";
    case "New York Red Bulls":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/190.png";
    case "Orlando City SC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/12011.png";
    case "Philadelphia Union":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/10739.png";
    case "Portland Timbers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9723.png";
    case "Real Salt Lake":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/4771.png";
    case "San Diego FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/22529.png";
    case "San Jose Earthquakes":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/191.png";
    case "Seattle Sounders FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9726.png";
    case "Sporting Kansas City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/186.png";
    case "St.Louis City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/21812.png";
    case "Toronto FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/7318.png";
    case "Vancouver Whitecaps":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9727.png";

    // Baseball
    // ABL
    case "Brisbane Bandits":
      return "https://assets.baseball.com.au/uploads/sites/8/2020/07/Site-Logo-for-MLBAM.png";
    case "Adelaide Giants":
      return "https://assets.baseball.com.au/uploads/sites/6/2019/11/Adelaide-2.png";
    case "Perth Heat":
      return "https://assets.baseball.com.au/uploads/sites/12/2019/10/Perth-1.png";
    case "Sydney Blue Sox":
      return "https://assets.baseball.com.au/uploads/sites/13/2023/07/Site-Logo-for-MLBAM.png";

    // MLB - American League East
    case "Baltimore Orioles":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/bal.png";
    case "Boston Red Sox":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/bos.png";
    case "New York Yankees":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/nyy.png";
    case "Tampa Bay Rays":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/tb.png";
    case "Toronto Blue Jays":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/tor.png";

    // MLB - American League Central
    case "Chicago White Sox":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/chw.png";
    case "Cleveland Guardians":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/cle.png";
    case "Detroit Tigers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/det.png";
    case "Kansas City Royals":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/kc.png";
    case "Minnesota Twins":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/min.png";

    // MLB - American League West
    case "Houston Astros":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/hou.png";
    case "Los Angeles Angels":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/laa.png";
    case "Oakland Athletics":
    case "Athletics":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/oak.png";
    case "Seattle Mariners":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/sea.png";
    case "Texas Rangers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/tex.png";

    // MLB - National League East
    case "Atlanta Braves":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/atl.png";
    case "Miami Marlins":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/mia.png";
    case "New York Mets":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/nym.png";
    case "Philadelphia Phillies":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/phi.png";
    case "Washington Nationals":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/wsh.png";

    // MLB - National League Central
    case "Chicago Cubs":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/chc.png";
    case "Cincinnati Reds":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/cin.png";
    case "Milwaukee Brewers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/mil.png";
    case "Pittsburgh Pirates":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/pit.png";
    case "St. Louis Cardinals":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/stl.png";

    // MLB - National League West
    case "Arizona Diamondbacks":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/ari.png";
    case "Colorado Rockies":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/col.png";
    case "Los Angeles Dodgers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/lad.png";
    case "San Diego Padres":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/sd.png";
    case "San Francisco Giants":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/sf.png";

    //Basketball
    //NBL
    case "Brisbane Bullets":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nbl/500/bri.png";
    case "Tasmania JackJumpers":
    case "Tasmania Jackjumpers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nbl/500/tas.png";
    case "Illawarra Hawks":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nbl/500/hwk.png";
    case "Sydney Kings":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nbl/500/syd.png";
    case "Melbourne United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nbl/500/mel.png";
    case "Cairns Taipans":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nbl/500/cns.png";
    case "Adelaide 36ers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nbl/500/adl.png";
    case "New Zealand Breakers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nbl/500/nzl.png";
    case "Perth Wildcats":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nbl/500/per.png";
    case "South East Melbourne Phoenix":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nbl/500/pnx.png";
    //WNBL
    case "Canberra Capitals":
      return "https://upload.wikimedia.org/wikipedia/en/3/3c/Canberra_Capitals_logo_new.png";
    case "Adelaide Lightning":
      return "https://upload.wikimedia.org/wikipedia/en/6/6b/Adelaide_Lightning_logo.png";
    case "Townsville Fire":
      return "https://upload.wikimedia.org/wikipedia/en/3/33/Townsville_Fire_2020.png";
    case "Geelong Venom":
      return "https://upload.wikimedia.org/wikipedia/en/3/3e/Geelong_Venom_logo.png";
    case "Perth Lynx":
      return "https://upload.wikimedia.org/wikipedia/en/7/75/Perth_Lynx_new_logo.png";
    case "Southside Flyers":
      return "https://upload.wikimedia.org/wikipedia/en/b/bf/Southside_Melbourne_Flyers_logo.png";
    case "Bendigo Spirit":
      return "https://upload.wikimedia.org/wikipedia/en/1/17/Bendigo_Spirit_new_logo.png";
    case "Sydney Flames":
      return "https://upload.wikimedia.org/wikipedia/en/7/7a/Sydney_Flames_new_logo.png";

    //NBA
    case "Detroit Pistons":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/det.png";
    case "Los Angeles Lakers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/lal.png";
    case "Sacramento Kings":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/sac.png";
    case "Golden State Warriors":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/gs.png";
    case "Boston Celtics":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/bos.png";
    case "Brooklyn Nets":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/bkn.png";
    case "Miami Heat":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/mia.png";
    case "Chicago Bulls":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/chi.png";
    case "New York Knicks":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/nyk.png";
    case "Toronto Raptors":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/tor.png";
    case "Milwaukee Bucks":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/mil.png";
    case "Philadelphia 76ers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/phi.png";
    case "Cleveland Cavaliers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/cle.png";
    case "Washington Wizards":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/wsh.png";
    case "Atlanta Hawks":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/atl.png";
    case "Orlando Magic":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/orl.png";
    case "Charlotte Hornets":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/cha.png";
    case "Indiana Pacers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/ind.png";
    case "Minnesota Timberwolves":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/min.png";
    case "Denver Nuggets":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/den.png";
    case "Utah Jazz":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/utah.png";
    case "Portland Trail Blazers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/por.png";
    case "Oklahoma City Thunder":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/okc.png";
    case "Houston Rockets":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/hou.png";
    case "San Antonio Spurs":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/sas.png";
    case "Dallas Mavericks":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/dal.png";
    case "Memphis Grizzlies":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/mem.png";
    case "New Orleans Pelicans":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/no.png";
    case "Los Angeles Clippers":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/lac.png";
    case "Phoenix Suns":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/phx.png";
    case "Minnesota Timberwolves":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/min.png";
    case "Sacramento Kings":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/sac.png";
    //WNBA
    case "Chicago Sky":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/chi.png";
    case "Connecticut Sun":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/con.png";
    case "Dallas Wings":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/dal.png";
    case "Indiana Fever":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/ind.png";
    case "Las Vegas Aces":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/lv.png";
    case "Los Angeles Sparks":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/la.png";
    case "Minnesota Lynx":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/min.png";
    case "New York Liberty":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/ny.png";
    case "Phoenix Mercury":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/phx.png";
    case "Seattle Storm":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/sea.png";
    case "Atlanta Dream":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/atl.png";
    case "Golden State Valkyries":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/gs.png";
    case "Washington Mystics":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/wsh.png";
    case "Toronto Tempo":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/tor.png";
    case "Portland Fire":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/por.png";

    // Special cricket team
    case "West Indies":
      return "/cricket/west-indies.svg";
    case "Chinese Taipei":
      return "https://upload.wikimedia.org/wikipedia/commons/3/3a/Flag_of_Chinese_Taipei_variant.svg";

    // Golf Players - Australia
    case "Min Woo Lee":
    case "Jason Day":
    case "Adam Scott":
    case "Cam Davis":
    case "Cameron Smith":
    case "Marc Leishman":
    case "Lucas Herbert":
    case "Matt Jones":
    case "Karl Vilips":
    case "Aaron Baddeley":
    case "Ryan Ruffels":
    case "Elvis Smylie":
    case "Wade Ormsby":
      return getCountryImageUrl(CountryFlagCode.Australia);

    // Golf Players - New Zealand
    case "Ryan Fox":
      return getCountryImageUrl(CountryFlagCode.NewZealand);

    // Golf Players - United States
    case "Scottie Scheffler":
    case "Xander Schauffele":
    case "Collin Morikawa":
    case "Justin Thomas":
    case "Russell Henley":
    case "Maverick McNealy":
    case "Bryson DeChambeau":
    case "Wyndham Clark":
    case "Patrick Cantlay":
    case "Keegan Bradley":
    case "Brian Harman":
    case "Billy Horschel":
    case "Akshay Bhatia":
    case "Daniel Berger":
    case "J.J. Spaun":
    case "Sahith Theegala":
    case "Jordan Spieth":
    case "Sam Burns":
    case "Will Zalatoris":
    case "Tony Finau":
    case "Rickie Fowler":
    case "Bubba Watson":
    case "Tiger Woods":
    case "Phil Mickelson":
    case "Dustin Johnson":
    case "Brooks Koepka":
    case "Luke Clanton":
    case "Max Homa":
    case "Andrew Novak":
    case "Michael Kim":
    case "Cameron Young":
    case "Patrick Reed":
    case "Ben Griffin":
    case "Harold Varner III":
    case "Kevin Kisner":
    case "Matt Kuchar":
    case "Kevin Na":
    case "Gary Woodland":
    case "Lucas Glover":
    case "Harris English":
    case "Chris Gotterup":
    case "Anthony Kim":
    case "Jake Knapp":
    case "Jacob Bridgeman":
    case "Max Greyserman":
    case "Michael Thorbjornsen":
    case "Neal Shipley":
    case "Joel Dahmen":
    case "Webb Simpson":
    case "Davis Riley":
    case "Kevin Streelman":
    case "Austin Eckroat":
    case "Beau Hossler":
    case "Dylan Wu":
    case "Blades Brown":
    case "Nick Dunlap":
    case "Brandt Snedeker":
    case "Charley Hoffman":
    case "Doug Ghim":
    case "Lanto Griffen":
      return getCountryImageUrl(CountryFlagCode.UnitedStates);

    // Golf Players - England
    case "Tommy Fleetwood":
    case "Justin Rose":
    case "Tyrrell Hatton":
    case "Aaron Rai":
    case "Matt Fitzpatrick":
    case "Paul Casey":
    case "Lee Westwood":
    case "Ian Poulter":
    case "Harry Hall":
    case "Marco Penge":
    case "Danny Willett":
      return getCountryImageUrl(CountryFlagCode.England);

    // Golf Players - Ireland & UK
    case "Shane Lowry":
      return getCountryImageUrl(CountryFlagCode.Ireland);
    case "Rory McIlroy":
    case "Tom Mckibbin":
      return getCountryImageUrl(CountryFlagCode.NorthernIreland);
    case "Robert MacIntyre":
      return getCountryImageUrl(CountryFlagCode.Scotland);

    // Golf Players - Other European
    case "Ludvig Åberg":
    case "Henrik Stenson":
      return getCountryImageUrl(CountryFlagCode.Sweden);
    case "Viktor Hovland":
      return getCountryImageUrl(CountryFlagCode.Norway);
    case "Sepp Straka":
      return getCountryImageUrl(CountryFlagCode.Austria);
    case "Thomas Pieters":
    case "Thomas Detry":
      return getCountryImageUrl(CountryFlagCode.Belgium);
    case "Thorbjørn Olesen":
    case "Rasmus Højgaard":
    case "Nicolai Højgaard":
    case "Rasmus Neergaard-Petersen":
      return getCountryImageUrl(CountryFlagCode.Denmark);
    case "Victor Perez":
    case "Matthieu Pavon":
      return getCountryImageUrl(CountryFlagCode.France);
    case "Adrian Meronk":
      return getCountryImageUrl(CountryFlagCode.Poland);

    // Golf Players - Asia
    case "Hideki Matsuyama":
    case "Ryo Hisatsune":
      return getCountryImageUrl(CountryFlagCode.Japan);
    case "Sungjae Im":
    case "Tom Kim":
    case "Byeong Hun An":
    case "Si Woo Kim":
      return getCountryImageUrl(CountryFlagCode.KoreaSouth);
    case "Anirban Lahiri":
      return getCountryImageUrl(CountryFlagCode.India);
    case "Haotong Li":
      return getCountryImageUrl(CountryFlagCode.China);

    // Golf Players - Americas
    case "Corey Conners":
    case "Nick Taylor":
    case "Mackenzie Hughes":
    case "Adam Hadwin":
      return getCountryImageUrl(CountryFlagCode.Canada);
    case "Sergio Garcia":
    case "Jon Rahm":
    case "David Puig":
      return getCountryImageUrl(CountryFlagCode.Spain);
    case "Joaquin Niemann":
    case "Mito Pereira":
      return getCountryImageUrl(CountryFlagCode.Chile);
    case "Abraham Ancer":
    case "Carlos Ortiz":
      return getCountryImageUrl(CountryFlagCode.Mexico);
    case "Emiliano Grillo":
      return getCountryImageUrl(CountryFlagCode.Argentina);
    case "Jhonattan Vegas":
      return getCountryImageUrl(CountryFlagCode.Venezuela);
    case "Nico Echavarria":
      return getCountryImageUrl(CountryFlagCode.Colombia);

    // Golf Players - Africa
    case "Louis Oosthuizen":
    case "Branden Grace":
    case "Charl Schwartzel":
    case "Aldrich Potgieter":
    case "Christiaan Bezuidenhout":
    case "Dean Burmester":
    case "Garrick Higgo":
    case "Erik van Rooyen":
      return getCountryImageUrl(CountryFlagCode.SouthAfrica);
    case "Scott Vincent":
      return getCountryImageUrl(CountryFlagCode.Zimbabwe);

    // Golf Tournaments - PGA Tour
    case "Mexico Open at VidantaWorld":
    case "World Wide Technology Championship":
      return getCountryImageUrl(CountryFlagCode.Mexico);
    case "Puerto Rico Open":
      return getCountryImageUrl(CountryFlagCode.PuertoRico);
    case "Corales Puntacana Championshi":
      return getCountryImageUrl(CountryFlagCode.DominicanRepublic);
    case "The Open Championship":
      return getCountryImageUrl(CountryFlagCode.UnitedKingdom);
    case "Genesis Scottish Open":
      return getCountryImageUrl(CountryFlagCode.Scotland);
    case "RBC Canadian Open":
      return getCountryImageUrl(CountryFlagCode.Canada);
    case "Baycurrent Classic":
      return getCountryImageUrl(CountryFlagCode.Japan);
    case "Butterfield Bermuda Championship":
      return getCountryImageUrl(CountryFlagCode.Bermuda);
    case "Hero World Challenge":
      return getCountryImageUrl(CountryFlagCode.Bahamas);

    // Golf Tournaments - LIV
    case "Riyadh":
      return getCountryImageUrl(CountryFlagCode.SaudiArabia);
    case "Adelaide":
      return getCountryImageUrl(CountryFlagCode.Australia);
    case "Hong Kong":
      return getCountryImageUrl(CountryFlagCode.HongKong);
    case "Singapore":
      return getCountryImageUrl(CountryFlagCode.Singapore);
    case "Mexico City":
      return getCountryImageUrl(CountryFlagCode.Mexico);
    case "Korea":
      return getCountryImageUrl(CountryFlagCode.KoreaSouth);
    case "Andalucía":
      return getCountryImageUrl(CountryFlagCode.Spain);
    case "United Kingdom":
      return getCountryImageUrl(CountryFlagCode.UnitedKingdom);

    // F1 - Grand Prix
    case "Australian Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Australia);
    case "Bahrain Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Bahrain);
    case "Chinese Grand Prix":
      return getCountryImageUrl(CountryFlagCode.China);
    case "Azerbaijan Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Azerbaijan);
    case "Emilia Romagna Grand Prix":
    case "Italian Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Italy);
    case "Monaco Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Monaco);
    case "Spanish Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Spain);
    case "Canadian Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Canada);
    case "Austrian Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Austria);
    case "British Grand Prix":
      return getCountryImageUrl(CountryFlagCode.UnitedKingdom);
    case "Hungarian Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Hungary);
    case "Belgian Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Belgium);
    case "Dutch Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Netherlands);
    case "Singapore Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Singapore);
    case "Japanese Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Japan);
    case "Qatar Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Qatar);
    case "Miami Grand Prix":
    case "United States Grand Prix":
    case "Las Vegas Grand Prix":
      return getCountryImageUrl(CountryFlagCode.UnitedStates);
    case "Mexico City Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Mexico);
    case "São Paulo Grand Prix":
      return getCountryImageUrl(CountryFlagCode.Brazil);
    case "Saudi Arabian Grand Prix":
      return getCountryImageUrl(CountryFlagCode.SaudiArabia);
    case "Abu Dhabi Grand Prix":
      return getCountryImageUrl(CountryFlagCode.UnitedArabEmirates);

    // F1 - Drivers
    case "Oscar Piastri":
    case "Jack Doohan":
      return getCountryImageUrl(CountryFlagCode.Australia);
    case "Andrea Kimi Antonelli":
      return getCountryImageUrl(CountryFlagCode.Italy);
    case "Charles Leclerc":
      return getCountryImageUrl(CountryFlagCode.Monaco);
    case "Carlos Sainz":
    case "Fernando Alonso":
      return getCountryImageUrl(CountryFlagCode.Spain);
    case "Lance Stroll":
      return getCountryImageUrl(CountryFlagCode.Canada);
    case "Lando Norris":
    case "George Russell":
    case "Lewis Hamilton":
    case "Oliver Bearman":
      return getCountryImageUrl(CountryFlagCode.UnitedKingdom);
    case "Max Verstappen":
      return getCountryImageUrl(CountryFlagCode.Netherlands);
    case "Yuki Tsunoda":
      return getCountryImageUrl(CountryFlagCode.Japan);
    case "Alexander Albon":
      return getCountryImageUrl(CountryFlagCode.Thailand);
    case "Nico Hülkenberg":
      return getCountryImageUrl(CountryFlagCode.Germany);
    case "Liam Lawson":
      return getCountryImageUrl(CountryFlagCode.NewZealand);
    case "Esteban Ocon":
    case "Pierre Gasly":
    case "Isack Hadjar":
      return getCountryImageUrl(CountryFlagCode.France);
    case "Franco Colapinto":
    case "Gabriel Bortoleto":
      return getCountryImageUrl(CountryFlagCode.Argentina);

    // Rugby Union
    case "All Blacks":
      return getCountryImageUrl(CountryFlagCode.NewZealand);
    // Super Rugby
    case "Queensland Reds":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/rugby/teams/500/182.png";
    case "NSW Waratahs":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/rugby/teams/500/227.png";
    case "Brumbies":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/rugby/teams/500/25889.png";
    case "Western Force":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/rugby/teams/500/25893.png";
    case "Fijian Drua":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/rugby/teams/500/289338.png";
    case "Moana Pasifika":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/rugby/teams/500/289319.png";
    case "Gallagher Chiefs":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/rugby/teams/500/25934.png";
    case "Hurricanes":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/rugby/teams/500/25939.png";
    case "Blues":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/rugby/teams/500/25932.png";
    case "Highlanders":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/rugby/teams/500/25938.png";
    case "Crusaders":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/rugby/teams/500/25936.png";

    // Countries
    case "Afghanistan":
      return getCountryImageUrl(CountryFlagCode.Afghanistan);
    case "Aland Islands":
      return getCountryImageUrl(CountryFlagCode.AlandIslands);
    case "Albania":
      return getCountryImageUrl(CountryFlagCode.Albania);
    case "Alaska":
      return getCountryImageUrl(CountryFlagCode.Alaska);
    case "Algeria":
      return getCountryImageUrl(CountryFlagCode.Algeria);
    case "American Samoa":
      return getCountryImageUrl(CountryFlagCode.AmericanSamoa);
    case "Andorra":
      return getCountryImageUrl(CountryFlagCode.Andorra);
    case "Angola":
      return getCountryImageUrl(CountryFlagCode.Angola);
    case "Anguilla":
      return getCountryImageUrl(CountryFlagCode.Anguilla);
    case "Antarctica":
      return getCountryImageUrl(CountryFlagCode.Antarctica);
    case "Antarctica Heard":
      return getCountryImageUrl(CountryFlagCode.AntarcticaHeard);
    case "Antigua And Barbuda":
      return getCountryImageUrl(CountryFlagCode.AntiguaAndBarbuda);
    case "Argentina":
      return getCountryImageUrl(CountryFlagCode.Argentina);
    case "Armenia":
      return getCountryImageUrl(CountryFlagCode.Armenia);
    case "Aruba":
      return getCountryImageUrl(CountryFlagCode.Aruba);
    case "Australia":
      return getCountryImageUrl(CountryFlagCode.Australia);
    case "Austria":
      return getCountryImageUrl(CountryFlagCode.Austria);
    case "Azerbaijan":
      return getCountryImageUrl(CountryFlagCode.Azerbaijan);
    case "Bahamas":
      return getCountryImageUrl(CountryFlagCode.Bahamas);
    case "Bahrain":
      return getCountryImageUrl(CountryFlagCode.Bahrain);
    case "Bangladesh":
      return getCountryImageUrl(CountryFlagCode.Bangladesh);
    case "Barbados":
      return getCountryImageUrl(CountryFlagCode.Barbados);
    case "Belarus":
      return getCountryImageUrl(CountryFlagCode.Belarus);
    case "Belgium":
      return getCountryImageUrl(CountryFlagCode.Belgium);
    case "Belize":
      return getCountryImageUrl(CountryFlagCode.Belize);
    case "Benin":
      return getCountryImageUrl(CountryFlagCode.Benin);
    case "Bermuda":
      return getCountryImageUrl(CountryFlagCode.Bermuda);
    case "Bhutan":
      return getCountryImageUrl(CountryFlagCode.Bhutan);
    case "Bolivia":
      return getCountryImageUrl(CountryFlagCode.Bolivia);
    case "Bonaire Sint Eustatius Saba":
      return getCountryImageUrl(CountryFlagCode.BonaireSintEustatiusSaba);
    case "Bosnia And Herzegovina":
    case "Bosnia & Herzegovina":
      return getCountryImageUrl(CountryFlagCode.BosniaAndHerzegovina);
    case "Botswana":
      return getCountryImageUrl(CountryFlagCode.Botswana);
    case "Bouvet Island":
      return getCountryImageUrl(CountryFlagCode.BouvetIsland);
    case "Brazil":
      return getCountryImageUrl(CountryFlagCode.Brazil);
    case "British Indian Ocean Territory":
      return getCountryImageUrl(CountryFlagCode.BritishIndianOceanTerritory);
    case "British Virgin Islands":
      return getCountryImageUrl(CountryFlagCode.BritishVirginIslands);
    case "Brunei Darussalam":
      return getCountryImageUrl(CountryFlagCode.BruneiDarussalam);
    case "Bulgaria":
      return getCountryImageUrl(CountryFlagCode.Bulgaria);
    case "Burkina Faso":
      return getCountryImageUrl(CountryFlagCode.BurkinaFaso);
    case "Burundi":
      return getCountryImageUrl(CountryFlagCode.Burundi);
    case "Cabo Verde":
      return getCountryImageUrl(CountryFlagCode.CaboVerde);
    case "Cambodia":
      return getCountryImageUrl(CountryFlagCode.Cambodia);
    case "Cameroon":
      return getCountryImageUrl(CountryFlagCode.Cameroon);
    case "Canada":
      return getCountryImageUrl(CountryFlagCode.Canada);
    case "Canary Islands":
      return getCountryImageUrl(CountryFlagCode.CanaryIslands);
    case "Cayman Islands":
      return getCountryImageUrl(CountryFlagCode.CaymanIslands);
    case "Central African Republic":
      return getCountryImageUrl(CountryFlagCode.CentralAfricanRepublic);
    case "Chad":
      return getCountryImageUrl(CountryFlagCode.Chad);
    case "Chile":
      return getCountryImageUrl(CountryFlagCode.Chile);
    case "China":
      return getCountryImageUrl(CountryFlagCode.China);
    case "Christmas Island":
      return getCountryImageUrl(CountryFlagCode.ChristmasIsland);
    case "Cocos Keeling Islands":
      return getCountryImageUrl(CountryFlagCode.CocosKeelingIslands);
    case "Colombia":
      return getCountryImageUrl(CountryFlagCode.Colombia);
    case "Comoros":
      return getCountryImageUrl(CountryFlagCode.Comoros);
    case "Congo":
      return getCountryImageUrl(CountryFlagCode.Congo);
    case "Congo Democratic Republic":
      return getCountryImageUrl(CountryFlagCode.CongoDemocraticRepublic);
    case "Cook Islands":
      return getCountryImageUrl(CountryFlagCode.CookIslands);
    case "Costa Rica":
      return getCountryImageUrl(CountryFlagCode.CostaRica);
    case "Cote D'Ivoire":
      return getCountryImageUrl(CountryFlagCode.CoteDIvoire);
    case "Croatia":
      return getCountryImageUrl(CountryFlagCode.Croatia);
    case "Cuba":
      return getCountryImageUrl(CountryFlagCode.Cuba);
    case "Curacao":
      return getCountryImageUrl(CountryFlagCode.Curacao);
    case "Cyprus":
      return getCountryImageUrl(CountryFlagCode.Cyprus);
    case "Czechia":
      return getCountryImageUrl(CountryFlagCode.Czechia);
    case "Denmark":
      return getCountryImageUrl(CountryFlagCode.Denmark);
    case "Djibouti":
      return getCountryImageUrl(CountryFlagCode.Djibouti);
    case "Dominica":
      return getCountryImageUrl(CountryFlagCode.Dominica);
    case "Dominican Republic":
      return getCountryImageUrl(CountryFlagCode.DominicanRepublic);
    case "Ecuador":
      return getCountryImageUrl(CountryFlagCode.Ecuador);
    case "Egypt":
      return getCountryImageUrl(CountryFlagCode.Egypt);
    case "El Salvador":
      return getCountryImageUrl(CountryFlagCode.ElSalvador);
    case "England":
      return getCountryImageUrl(CountryFlagCode.England);
    case "Equatorial Guinea":
      return getCountryImageUrl(CountryFlagCode.EquatorialGuinea);
    case "Eritrea":
      return getCountryImageUrl(CountryFlagCode.Eritrea);
    case "Estonia":
      return getCountryImageUrl(CountryFlagCode.Estonia);
    case "Eswatini":
      return getCountryImageUrl(CountryFlagCode.Eswatini);
    case "Ethiopia":
      return getCountryImageUrl(CountryFlagCode.Ethiopia);
    case "European Union":
      return getCountryImageUrl(CountryFlagCode.EuropeanUnion);
    case "Faroe Islands":
      return getCountryImageUrl(CountryFlagCode.FaroeIslands);
    case "Fiji":
      return getCountryImageUrl(CountryFlagCode.Fiji);
    case "Finland":
      return getCountryImageUrl(CountryFlagCode.Finland);
    case "France":
      return getCountryImageUrl(CountryFlagCode.France);
    case "French Guiana":
      return getCountryImageUrl(CountryFlagCode.FrenchGuiana);
    case "French Polynesia":
      return getCountryImageUrl(CountryFlagCode.FrenchPolynesia);
    case "French Southern Territories":
      return getCountryImageUrl(CountryFlagCode.FrenchSouthernTerritories);
    case "Gabon":
      return getCountryImageUrl(CountryFlagCode.Gabon);
    case "Gambia":
      return getCountryImageUrl(CountryFlagCode.Gambia);
    case "Georgia":
      return getCountryImageUrl(CountryFlagCode.Georgia);
    case "Germany":
      return getCountryImageUrl(CountryFlagCode.Germany);
    case "Ghana":
      return getCountryImageUrl(CountryFlagCode.Ghana);
    case "Gibraltar":
      return getCountryImageUrl(CountryFlagCode.Gibraltar);
    case "Greece":
      return getCountryImageUrl(CountryFlagCode.Greece);
    case "Greenland":
      return getCountryImageUrl(CountryFlagCode.Greenland);
    case "Grenada":
      return getCountryImageUrl(CountryFlagCode.Grenada);
    case "Guadeloupe":
      return getCountryImageUrl(CountryFlagCode.Guadeloupe);
    case "Guam":
      return getCountryImageUrl(CountryFlagCode.Guam);
    case "Guatemala":
      return getCountryImageUrl(CountryFlagCode.Guatemala);
    case "Guernsey":
      return getCountryImageUrl(CountryFlagCode.Guernsey);
    case "Guinea":
      return getCountryImageUrl(CountryFlagCode.Guinea);
    case "Guinea-Bissau":
      return getCountryImageUrl(CountryFlagCode.GuineaBissau);
    case "Guyana":
      return getCountryImageUrl(CountryFlagCode.Guyana);
    case "Haiti":
      return getCountryImageUrl(CountryFlagCode.Haiti);
    case "Heard Island And McDonald Islands":
      return getCountryImageUrl(CountryFlagCode.HeardIslandAndMcDonaldIslands);
    case "Holy See":
      return getCountryImageUrl(CountryFlagCode.HolySee);
    case "Honduras":
      return getCountryImageUrl(CountryFlagCode.Honduras);
    case "Hong Kong":
      return getCountryImageUrl(CountryFlagCode.HongKong);
    case "Hungary":
      return getCountryImageUrl(CountryFlagCode.Hungary);
    case "Iceland":
      return getCountryImageUrl(CountryFlagCode.Iceland);
    case "India":
      return getCountryImageUrl(CountryFlagCode.India);
    case "Indonesia":
      return getCountryImageUrl(CountryFlagCode.Indonesia);
    case "Iran":
      return getCountryImageUrl(CountryFlagCode.Iran);
    case "Iraq":
      return getCountryImageUrl(CountryFlagCode.Iraq);
    case "Ireland":
      return getCountryImageUrl(CountryFlagCode.Ireland);
    case "Isle Of Man":
      return getCountryImageUrl(CountryFlagCode.IsleOfMan);
    case "Israel":
      return getCountryImageUrl(CountryFlagCode.Israel);
    case "Italy":
      return getCountryImageUrl(CountryFlagCode.Italy);
    case "Jamaica":
      return getCountryImageUrl(CountryFlagCode.Jamaica);
    case "Japan":
      return getCountryImageUrl(CountryFlagCode.Japan);
    case "Jersey":
      return getCountryImageUrl(CountryFlagCode.Jersey);
    case "Jordan":
      return getCountryImageUrl(CountryFlagCode.Jordan);
    case "Kazakhstan":
      return getCountryImageUrl(CountryFlagCode.Kazakhstan);
    case "Kenya":
      return getCountryImageUrl(CountryFlagCode.Kenya);
    case "Kiribati":
      return getCountryImageUrl(CountryFlagCode.Kiribati);
    case "Korea North":
      return getCountryImageUrl(CountryFlagCode.KoreaNorth);
    case "Korea":
    case "South Korea":
    case "Korea South":
      return getCountryImageUrl(CountryFlagCode.KoreaSouth);
    case "Kosovo":
      return getCountryImageUrl(CountryFlagCode.Kosovo);
    case "Kuwait":
      return getCountryImageUrl(CountryFlagCode.Kuwait);
    case "Kyrgyzstan":
      return getCountryImageUrl(CountryFlagCode.Kyrgyzstan);
    case "Laos":
      return getCountryImageUrl(CountryFlagCode.Laos);
    case "Latvia":
      return getCountryImageUrl(CountryFlagCode.Latvia);
    case "Lebanon":
      return getCountryImageUrl(CountryFlagCode.Lebanon);
    case "Lesotho":
      return getCountryImageUrl(CountryFlagCode.Lesotho);
    case "Liberia":
      return getCountryImageUrl(CountryFlagCode.Liberia);
    case "Libya":
      return getCountryImageUrl(CountryFlagCode.Libya);
    case "Liechtenstein":
      return getCountryImageUrl(CountryFlagCode.Liechtenstein);
    case "Lithuania":
      return getCountryImageUrl(CountryFlagCode.Lithuania);
    case "Luxembourg":
      return getCountryImageUrl(CountryFlagCode.Luxembourg);
    case "Macao":
      return getCountryImageUrl(CountryFlagCode.Macao);
    case "Madagascar":
      return getCountryImageUrl(CountryFlagCode.Madagascar);
    case "Malawi":
      return getCountryImageUrl(CountryFlagCode.Malawi);
    case "Malaysia":
      return getCountryImageUrl(CountryFlagCode.Malaysia);
    case "Maldives":
      return getCountryImageUrl(CountryFlagCode.Maldives);
    case "Mali":
      return getCountryImageUrl(CountryFlagCode.Mali);
    case "Malta":
      return getCountryImageUrl(CountryFlagCode.Malta);
    case "Marshall Islands":
      return getCountryImageUrl(CountryFlagCode.MarshallIslands);
    case "Martinique":
      return getCountryImageUrl(CountryFlagCode.Martinique);
    case "Mauritania":
      return getCountryImageUrl(CountryFlagCode.Mauritania);
    case "Mauritius":
      return getCountryImageUrl(CountryFlagCode.Mauritius);
    case "Mayotte":
      return getCountryImageUrl(CountryFlagCode.Mayotte);
    case "Mexico":
      return getCountryImageUrl(CountryFlagCode.Mexico);
    case "Micronesia":
      return getCountryImageUrl(CountryFlagCode.Micronesia);
    case "Moldova":
      return getCountryImageUrl(CountryFlagCode.Moldova);
    case "Monaco":
      return getCountryImageUrl(CountryFlagCode.Monaco);
    case "Mongolia":
      return getCountryImageUrl(CountryFlagCode.Mongolia);
    case "Montenegro":
      return getCountryImageUrl(CountryFlagCode.Montenegro);
    case "Montserrat":
      return getCountryImageUrl(CountryFlagCode.Montserrat);
    case "Morocco":
      return getCountryImageUrl(CountryFlagCode.Morocco);
    case "Mozambique":
      return getCountryImageUrl(CountryFlagCode.Mozambique);
    case "Myanmar":
      return getCountryImageUrl(CountryFlagCode.Myanmar);
    case "Namibia":
      return getCountryImageUrl(CountryFlagCode.Namibia);
    case "Nauru":
      return getCountryImageUrl(CountryFlagCode.Nauru);
    case "Nepal":
      return getCountryImageUrl(CountryFlagCode.Nepal);
    case "Netherlands":
      return getCountryImageUrl(CountryFlagCode.Netherlands);
    case "Netherlands Antilles":
      return getCountryImageUrl(CountryFlagCode.NetherlandsAntilles);
    case "New Caledonia":
      return getCountryImageUrl(CountryFlagCode.NewCaledonia);
    case "New York":
      return getCountryImageUrl(CountryFlagCode.NewYork);
    case "New Zealand":
      return getCountryImageUrl(CountryFlagCode.NewZealand);
    case "Nicaragua":
      return getCountryImageUrl(CountryFlagCode.Nicaragua);
    case "Niger":
      return getCountryImageUrl(CountryFlagCode.Niger);
    case "Nigeria":
      return getCountryImageUrl(CountryFlagCode.Nigeria);
    case "Niue":
      return getCountryImageUrl(CountryFlagCode.Niue);
    case "Norfolk Island":
      return getCountryImageUrl(CountryFlagCode.NorfolkIsland);
    case "North Macedonia":
      return getCountryImageUrl(CountryFlagCode.NorthMacedonia);
    case "Northern Ireland":
      return getCountryImageUrl(CountryFlagCode.NorthernIreland);
    case "Northern Mariana Islands":
      return getCountryImageUrl(CountryFlagCode.NorthernMarianaIslands);
    case "Norway":
      return getCountryImageUrl(CountryFlagCode.Norway);
    case "Oman":
      return getCountryImageUrl(CountryFlagCode.Oman);
    case "Pakistan":
      return getCountryImageUrl(CountryFlagCode.Pakistan);
    case "Palau":
      return getCountryImageUrl(CountryFlagCode.Palau);
    case "Panama":
      return getCountryImageUrl(CountryFlagCode.Panama);
    case "Papua New Guinea":
      return getCountryImageUrl(CountryFlagCode.PapuaNewGuinea);
    case "Paraguay":
      return getCountryImageUrl(CountryFlagCode.Paraguay);
    case "Peru":
      return getCountryImageUrl(CountryFlagCode.Peru);
    case "Philippines":
      return getCountryImageUrl(CountryFlagCode.Philippines);
    case "Pitcairn":
      return getCountryImageUrl(CountryFlagCode.Pitcairn);
    case "Poland":
      return getCountryImageUrl(CountryFlagCode.Poland);
    case "Portugal":
      return getCountryImageUrl(CountryFlagCode.Portugal);
    case "Puerto Rico":
      return getCountryImageUrl(CountryFlagCode.PuertoRico);
    case "Qatar":
      return getCountryImageUrl(CountryFlagCode.Qatar);
    case "Reunion":
      return getCountryImageUrl(CountryFlagCode.Reunion);
    case "Romania":
      return getCountryImageUrl(CountryFlagCode.Romania);
    case "Russia":
      return getCountryImageUrl(CountryFlagCode.Russia);
    case "Rwanda":
      return getCountryImageUrl(CountryFlagCode.Rwanda);
    case "Saint Barthelemy":
      return getCountryImageUrl(CountryFlagCode.SaintBarthelemy);
    case "Saint Helena":
      return getCountryImageUrl(CountryFlagCode.SaintHelena);
    case "Saint Kitts And Nevis":
      return getCountryImageUrl(CountryFlagCode.SaintKittsAndNevis);
    case "Saint Lucia":
      return getCountryImageUrl(CountryFlagCode.SaintLucia);
    case "Saint Martin":
      return getCountryImageUrl(CountryFlagCode.SaintMartin);
    case "Saint Pierre And Miquelon":
      return getCountryImageUrl(CountryFlagCode.SaintPierreAndMiquelon);
    case "Saint Vincent And Grenadines":
      return getCountryImageUrl(CountryFlagCode.SaintVincentAndGrenadines);
    case "Samoa":
      return getCountryImageUrl(CountryFlagCode.Samoa);
    case "San Marino":
      return getCountryImageUrl(CountryFlagCode.SanMarino);
    case "Sao Tome And Principe":
      return getCountryImageUrl(CountryFlagCode.SaoTomeAndPrincipe);
    case "Saudi Arabia":
      return getCountryImageUrl(CountryFlagCode.SaudiArabia);
    case "Scotland":
      return getCountryImageUrl(CountryFlagCode.Scotland);
    case "Senegal":
      return getCountryImageUrl(CountryFlagCode.Senegal);
    case "Serbia":
      return getCountryImageUrl(CountryFlagCode.Serbia);
    case "Seychelles":
      return getCountryImageUrl(CountryFlagCode.Seychelles);
    case "Sierra Leone":
      return getCountryImageUrl(CountryFlagCode.SierraLeone);
    case "Singapore":
      return getCountryImageUrl(CountryFlagCode.Singapore);
    case "Sint Maarten":
      return getCountryImageUrl(CountryFlagCode.SintMaarten);
    case "Slovakia":
      return getCountryImageUrl(CountryFlagCode.Slovakia);
    case "Slovenia":
      return getCountryImageUrl(CountryFlagCode.Slovenia);
    case "Solomon Islands":
      return getCountryImageUrl(CountryFlagCode.SolomonIslands);
    case "Somalia":
      return getCountryImageUrl(CountryFlagCode.Somalia);
    case "South Africa":
      return getCountryImageUrl(CountryFlagCode.SouthAfrica);
    case "South Sudan":
      return getCountryImageUrl(CountryFlagCode.SouthSudan);
    case "Spain":
      return getCountryImageUrl(CountryFlagCode.Spain);
    case "Sri Lanka":
      return getCountryImageUrl(CountryFlagCode.SriLanka);
    case "Sudan":
      return getCountryImageUrl(CountryFlagCode.Sudan);
    case "Suriname":
      return getCountryImageUrl(CountryFlagCode.Suriname);
    case "Svalbard And Jan Mayen":
      return getCountryImageUrl(CountryFlagCode.SvalbardAndJanMayen);
    case "Sweden":
      return getCountryImageUrl(CountryFlagCode.Sweden);
    case "Switzerland":
      return getCountryImageUrl(CountryFlagCode.Switzerland);
    case "Syria":
      return getCountryImageUrl(CountryFlagCode.Syria);
    case "Taiwan":
      return getCountryImageUrl(CountryFlagCode.Taiwan);
    case "Tajikistan":
      return getCountryImageUrl(CountryFlagCode.Tajikistan);
    case "Tanzania":
      return getCountryImageUrl(CountryFlagCode.Tanzania);
    case "Thailand":
      return getCountryImageUrl(CountryFlagCode.Thailand);
    case "Timor-Leste":
      return getCountryImageUrl(CountryFlagCode.TimorLeste);
    case "Togo":
      return getCountryImageUrl(CountryFlagCode.Togo);
    case "Tokelau":
      return getCountryImageUrl(CountryFlagCode.Tokelau);
    case "Tonga":
      return getCountryImageUrl(CountryFlagCode.Tonga);
    case "Trinidad And Tobago":
      return getCountryImageUrl(CountryFlagCode.TrinidadAndTobago);
    case "Tunisia":
      return getCountryImageUrl(CountryFlagCode.Tunisia);
    case "Turkey":
    case "Türkiye":
      return getCountryImageUrl(CountryFlagCode.Turkey);
    case "Turkmenistan":
      return getCountryImageUrl(CountryFlagCode.Turkmenistan);
    case "Turks And Caicos Islands":
      return getCountryImageUrl(CountryFlagCode.TurksAndCaicosIslands);
    case "Tuvalu":
      return getCountryImageUrl(CountryFlagCode.Tuvalu);
    case "Uganda":
      return getCountryImageUrl(CountryFlagCode.Uganda);
    case "Ukraine":
      return getCountryImageUrl(CountryFlagCode.Ukraine);
    case "United Arab Emirates":
      return getCountryImageUrl(CountryFlagCode.UnitedArabEmirates);
    case "United Kingdom":
    case "Great Britan":
      return getCountryImageUrl(CountryFlagCode.UnitedKingdom);
    case "United States":
    case "USA":
    case "US":
      return getCountryImageUrl(CountryFlagCode.UnitedStates);
    case "United States Minor Outlying Islands":
      return getCountryImageUrl(
        CountryFlagCode.UnitedStatesMinorOutlyingIslands,
      );
    case "Uruguay":
      return getCountryImageUrl(CountryFlagCode.Uruguay);
    case "US Virgin Islands":
      return getCountryImageUrl(CountryFlagCode.USVirginIslands);
    case "Uzbekistan":
      return getCountryImageUrl(CountryFlagCode.Uzbekistan);
    case "Vanuatu":
      return getCountryImageUrl(CountryFlagCode.Vanuatu);
    case "Vatican City":
      return getCountryImageUrl(CountryFlagCode.VaticanCity);
    case "Venezuela":
      return getCountryImageUrl(CountryFlagCode.Venezuela);
    case "Vietnam":
      return getCountryImageUrl(CountryFlagCode.Vietnam);
    case "Wales":
      return getCountryImageUrl(CountryFlagCode.Wales);
    case "Wallis And Futuna":
      return getCountryImageUrl(CountryFlagCode.WallisAndFutuna);
    case "Western Sahara":
      return getCountryImageUrl(CountryFlagCode.WesternSahara);
    case "Yemen":
      return getCountryImageUrl(CountryFlagCode.Yemen);
    case "Zambia":
      return getCountryImageUrl(CountryFlagCode.Zambia);
    case "Zimbabwe":
      return getCountryImageUrl(CountryFlagCode.Zimbabwe);

    default:
      return fallback;
  }
}
