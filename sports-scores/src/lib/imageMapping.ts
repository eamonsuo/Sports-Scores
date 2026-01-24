import { CountryFlagCode } from "@/types/misc";
import { getCountryImageUrl } from "./projUtils";

const fallback = "/vercel.svg";

export function resolveGolfTeamImage(teamName: string) {
  switch (teamName) {
    case "4ACES GC":
      return "/liv/4aces.webp";
    case "LEGION XIII":
      return "/liv/legion13.webp";
    case "CRUSHERS GC":
      return "/liv/crushers.webp";
    case "STINGER GC":
      return "/liv/stinger.webp";
    case "FIREBALLS GC":
      return "/liv/fireballs.webp";
    case "CLEEKS GOLF CLUB":
      return "/liv/cleeks.webp";
    case "TORQUE GC":
      return "/liv/torque.webp";
    case "RIPPER GC":
      return "/liv/ripper.webp";
    case "HYFLYERS GC":
      return "/liv/hyflyers.webp";
    case "MAJESTICKS GC":
      return "/liv/majesticks.webp";
    case "RANGEGOATS GC":
      return "/liv/rangegoats.webp";
    case "SMASH GC":
      return "/liv/smash.webp";
    case "IRON HEADS GC":
      return "/liv/ironheads.webp";
    default:
      return fallback;
  }
}

export function resolveGolfPlayerImage(playerName: string) {
  var countryCode = (() => {
    switch (playerName) {
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
        return CountryFlagCode.Australia;

      case "Ryan Fox":
        return CountryFlagCode.NewZealand;

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
        return CountryFlagCode.UnitedStates;

      case "Tommy Fleetwood":
      case "Justin Rose":
      case "Tyrrell Hatton":
      case "Aaron Rai":
      case "Matt Fitzpatrick":
      case "Paul Casey":
      case "Lee Westwood":
      case "Ian Poulter":
      case "Harry Hall":
        return CountryFlagCode.England;

      case "Shane Lowry":
        return CountryFlagCode.Ireland;
      case "Rory McIlroy":
        return CountryFlagCode.NorthernIreland;
      case "Robert MacIntyre":
        return CountryFlagCode.Scotland;

      case "Ludvig Åberg":
      case "Henrik Stenson":
        return CountryFlagCode.Sweden;

      case "Hideki Matsuyama":
        return CountryFlagCode.Japan;

      case "Viktor Hovland":
        return CountryFlagCode.Norway;

      case "Sepp Straka":
        return CountryFlagCode.Austria;

      case "Sungjae Im":
      case "Tom Kim":
      case "Byeong Hun An":
      case "Si Woo Kim":
        return CountryFlagCode.KoreaSouth;

      case "Corey Conners":
      case "Nick Taylor":
        return CountryFlagCode.Canada;

      case "Sergio Garcia":
      case "Jon Rahm":
      case "David Puig":
        return CountryFlagCode.Spain;

      case "Joaquin Niemann":
      case "Mito Pereira":
        return CountryFlagCode.Chile;

      case "Louis Oosthuizen":
      case "Branden Grace":
      case "Charl Schwartzel":
      case "Aldrich Potgieter":
        return CountryFlagCode.SouthAfrica;

      case "Thomas Pieters":
      case "Thomas Detry":
        return CountryFlagCode.Belgium;

      case "Thorbjørn Olesen":
      case "Rasmus Højgaard":
      case "Nicolai Højgaard":
        return CountryFlagCode.Denmark;

      case "Victor Perez":
      case "Matthieu Pavon":
        return CountryFlagCode.France;

      case "Abraham Ancer":
      case "Carlos Ortiz":
        return CountryFlagCode.Mexico;

      case "Adrian Meronk":
        return CountryFlagCode.Poland;

      case "Anirban Lahiri":
        return CountryFlagCode.India;
    }
  })();

  return getCountryImageUrl(countryCode);
}

export function resolveGolfTournamentImage(tournamentName: string) {
  var countryCode = (() => {
    switch (tournamentName) {
      // PGA Tour
      case "Mexico Open at VidantaWorld":
      case "World Wide Technology Championship":
        return CountryFlagCode.Mexico;

      case "Puerto Rico Open":
        return CountryFlagCode.PuertoRico;

      case "Corales Puntacana Championshi":
        return CountryFlagCode.DominicanRepublic;

      case "The Open Championship":
        return CountryFlagCode.UnitedKingdom;
      case "Genesis Scottish Open":
        return CountryFlagCode.Scotland;

      case "RBC Canadian Open":
        return CountryFlagCode.Canada;

      case "Baycurrent Classic":
        return CountryFlagCode.Japan;

      case "Butterfield Bermuda Championship":
        return CountryFlagCode.Bermuda;

      case "Hero World Challenge":
        return CountryFlagCode.Bahamas;

      // LIV Golf
      case "Riyadh":
        return CountryFlagCode.SaudiArabia;
      case "Adelaide":
        return CountryFlagCode.Australia;
      case "Hong Kong":
        return CountryFlagCode.HongKong;
      case "Singapore":
        return CountryFlagCode.Singapore;
      case "Mexico City":
        return CountryFlagCode.Mexico;
      case "Korea":
        return CountryFlagCode.KoreaSouth;
      case "Andalucía":
        return CountryFlagCode.Spain;
      case "United Kingdom":
        return CountryFlagCode.UnitedKingdom;

      default:
        return CountryFlagCode.UnitedStates;
    }
  })();

  return getCountryImageUrl(countryCode);
}

export function resolveNRLImages(teamName: string) {
  switch (teamName) {
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
    default:
      return resolveCountryImage(teamName) ?? fallback;
  }
}

export function resolveAussieRulesImages(teamName: string) {
  switch (teamName) {
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
    default:
      return fallback;
  }
}

export function resolveNFLImages(teamName: string) {
  switch (teamName) {
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
    default:
      return fallback;
  }
}

export function resolveF1CountryFlagImages(name: string) {
  var countryCode = (() => {
    switch (name) {
      case "Australian Grand Prix":
      case "Oscar Piastri":
      case "Jack Doohan":
        return CountryFlagCode.Australia;
      case "Bahrain Grand Prix":
        return CountryFlagCode.Bahrain;
      case "Chinese Grand Prix":
        return CountryFlagCode.China;
      case "Azerbaijan Grand Prix":
        return CountryFlagCode.Azerbaijan;
      case "Emilia Romagna Grand Prix":
      case "Italian Grand Prix":
      case "Andrea Kimi Antonelli":
        return CountryFlagCode.Italy;
      case "Monaco Grand Prix":
      case "Charles Leclerc":
        return CountryFlagCode.Monaco;
      case "Spanish Grand Prix":
      case "Carlos Sainz":
      case "Fernando Alonso":
        return CountryFlagCode.Spain;
      case "Canadian Grand Prix":
      case "Lance Stroll":
        return CountryFlagCode.Canada;
      case "Austrian Grand Prix":
        return CountryFlagCode.Austria;
      case "British Grand Prix":
      case "Lando Norris":
      case "George Russell":
      case "Lewis Hamilton":
      case "Oliver Bearman":
        return CountryFlagCode.UnitedKingdom;
      case "Hungarian Grand Prix":
        return CountryFlagCode.Hungary;
      case "Belgian Grand Prix":
        return CountryFlagCode.Belgium;
      case "Dutch Grand Prix":
      case "Max Verstappen":
        return CountryFlagCode.Netherlands;
      case "Singapore Grand Prix":
        return CountryFlagCode.Singapore;
      case "Japanese Grand Prix":
      case "Yuki Tsunoda":
        return CountryFlagCode.Japan;
      case "Qatar Grand Prix":
        return CountryFlagCode.Qatar;
      case "Miami Grand Prix":
      case "United States Grand Prix":
      case "Las Vegas Grand Prix":
        return CountryFlagCode.UnitedStates;
      case "Mexico City Grand Prix":
        return CountryFlagCode.Mexico;
      case "São Paulo Grand Prix":
      case "Gabriel Bortoleto":
        return CountryFlagCode.Brazil;
      case "Saudi Arabian Grand Prix":
        return CountryFlagCode.SaudiArabia;
      case "Abu Dhabi Grand Prix":
        return CountryFlagCode.UnitedArabEmirates;
      case "Alexander Albon":
        return CountryFlagCode.Thailand;
      case "Nico Hülkenberg":
        return CountryFlagCode.Germany;
      case "Liam Lawson":
        return CountryFlagCode.NewZealand;
      case "Esteban Ocon":
      case "Pierre Gasly":
      case "Isack Hadjar":
        return CountryFlagCode.France;
      case "Franco Colapinto":
        return CountryFlagCode.Argentina;
    }
  })();

  return getCountryImageUrl(countryCode);
}

export function resolveF1TeamImages(teamName: string) {
  switch (teamName) {
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
      return "/f1/racing-bulls-f1.svg";
    case "Sauber":
      return "/f1/sauber.webp";
    case "Haas F1 Team":
      return "/f1/haas.png";
    case "Williams":
      return "/f1/williams-f1.svg";
    default:
      return fallback;
  }
}

export function resolveCricketTeamImages(teamName: string) {
  switch (teamName) {
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
    default:
      return resolveCountryImage(teamName) ?? fallback;
  }
}

export function resolveFootballTeamImage(teamName: string) {
  switch (teamName) {
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
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/363.png";
    case "Liverpool":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/364.png";
    case "Tottenham Hotspur":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/367.png";
    case "Everton":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/368.png";
    case "West Ham United":
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
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/331.png";
    case "Burnley":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/379.png";
    case "Norwich City":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/381.png";
    case "Fulham":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/370.png";
    case "Sheffield United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/356.png";
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

    // Bundesliga
    case "1. FC Heidenheim 1846":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/6418.png";
    case "1. FC Union Berlin":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/598.png";
    case "Bayer Leverkusen":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/131.png";
    case "Bayern Munich":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/132.png";
    case "Borussia Dortmund":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/124.png";
    case "Borussia Mönchengladbach":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/268.png";
    case "Eintracht Frankfurt":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/125.png";
    case "FC Augsburg":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3841.png";
    case "FC Cologne":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/122.png";
    case "Hamburg SV":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/127.png";
    case "Mainz":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2950.png";
    case "RB Leipzig":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/11420.png";
    case "SC Freiburg":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/126.png";
    case "St. Pauli":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/270.png";
    case "TSG Hoffenheim":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/7911.png";
    case "VfB Stuttgart":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/134.png";
    case "VfL Wolfsburg":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/138.png";
    case "Werder Bremen":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/137.png";

    // Serie A
    case "AC Milan":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/103.png";
    case "AS Roma":
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
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9812.png";
    case "Levante":
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
    case "Atlanta United FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18418.png";
    case "Austin FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/20906.png";
    case "CF Montréal":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9720.png";
    case "Charlotte FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/21300.png";
    case "Chicago Fire FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/182.png";
    case "Colorado Rapids":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/184.png";
    case "Columbus Crew":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/183.png";
    case "D.C. United":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/193.png";
    case "FC Cincinnati":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18267.png";
    case "FC Dallas":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/185.png";
    case "Houston Dynamo FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/6077.png";
    case "Inter Miami CF":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/20232.png";
    case "LA Galaxy":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/187.png";
    case "LAFC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18966.png";
    case "Minnesota United FC":
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
    case "St. Louis CITY SC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/21812.png";
    case "Toronto FC":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/7318.png";
    case "Vancouver Whitecaps":
      return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9727.png";

    default:
      return resolveCountryImage(teamName) ?? fallback;
  }
}

export function resolveBaseballTeamImage(teamName: string) {
  switch (teamName) {
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

    default:
      return resolveCountryImage(teamName) ?? fallback;
  }
}

export function resolveBasketballTeamImage(teamName: string) {
  switch (teamName) {
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
    default:
      return resolveCountryImage(teamName) ?? fallback;
  }
}

export function resolveTennisImage(teamName: string) {
  switch (teamName) {
    case "Alex De Minaur":
      return resolveCountryImage("Australia");

    default:
      return resolveCountryImage(teamName) ?? fallback;
  }
}

export function resolveCountryImage(countryName: string) {
  var countryCode = (() => {
    switch (countryName) {
      case "Afghanistan":
        return CountryFlagCode.Afghanistan;
      case "Aland Islands":
        return CountryFlagCode.AlandIslands;
      case "Albania":
        return CountryFlagCode.Albania;
      case "Alaska":
        return CountryFlagCode.Alaska;
      case "Algeria":
        return CountryFlagCode.Algeria;
      case "American Samoa":
        return CountryFlagCode.AmericanSamoa;
      case "Andorra":
        return CountryFlagCode.Andorra;
      case "Angola":
        return CountryFlagCode.Angola;
      case "Anguilla":
        return CountryFlagCode.Anguilla;
      case "Antarctica":
        return CountryFlagCode.Antarctica;
      case "Antarctica Heard":
        return CountryFlagCode.AntarcticaHeard;
      case "Antigua And Barbuda":
        return CountryFlagCode.AntiguaAndBarbuda;
      case "Argentina":
        return CountryFlagCode.Argentina;
      case "Armenia":
        return CountryFlagCode.Armenia;
      case "Aruba":
        return CountryFlagCode.Aruba;
      case "Australia":
        return CountryFlagCode.Australia;
      case "Austria":
        return CountryFlagCode.Austria;
      case "Azerbaijan":
        return CountryFlagCode.Azerbaijan;
      case "Bahamas":
        return CountryFlagCode.Bahamas;
      case "Bahrain":
        return CountryFlagCode.Bahrain;
      case "Bangladesh":
        return CountryFlagCode.Bangladesh;
      case "Barbados":
        return CountryFlagCode.Barbados;
      case "Belarus":
        return CountryFlagCode.Belarus;
      case "Belgium":
        return CountryFlagCode.Belgium;
      case "Belize":
        return CountryFlagCode.Belize;
      case "Benin":
        return CountryFlagCode.Benin;
      case "Bermuda":
        return CountryFlagCode.Bermuda;
      case "Bhutan":
        return CountryFlagCode.Bhutan;
      case "Bolivia":
        return CountryFlagCode.Bolivia;
      case "Bonaire Sint Eustatius Saba":
        return CountryFlagCode.BonaireSintEustatiusSaba;
      case "Bosnia And Herzegovina":
      case "Bosnia & Herzegovina":
        return CountryFlagCode.BosniaAndHerzegovina;
      case "Botswana":
        return CountryFlagCode.Botswana;
      case "Bouvet Island":
        return CountryFlagCode.BouvetIsland;
      case "Brazil":
        return CountryFlagCode.Brazil;
      case "British Indian Ocean Territory":
        return CountryFlagCode.BritishIndianOceanTerritory;
      case "British Virgin Islands":
        return CountryFlagCode.BritishVirginIslands;
      case "Brunei Darussalam":
        return CountryFlagCode.BruneiDarussalam;
      case "Bulgaria":
        return CountryFlagCode.Bulgaria;
      case "Burkina Faso":
        return CountryFlagCode.BurkinaFaso;
      case "Burundi":
        return CountryFlagCode.Burundi;
      case "Cabo Verde":
        return CountryFlagCode.CaboVerde;
      case "Cambodia":
        return CountryFlagCode.Cambodia;
      case "Cameroon":
        return CountryFlagCode.Cameroon;
      case "Canada":
        return CountryFlagCode.Canada;
      case "Canary Islands":
        return CountryFlagCode.CanaryIslands;
      case "Cayman Islands":
        return CountryFlagCode.CaymanIslands;
      case "Central African Republic":
        return CountryFlagCode.CentralAfricanRepublic;
      case "Chad":
        return CountryFlagCode.Chad;
      case "Chile":
        return CountryFlagCode.Chile;
      case "China":
        return CountryFlagCode.China;
      case "Christmas Island":
        return CountryFlagCode.ChristmasIsland;
      case "Cocos Keeling Islands":
        return CountryFlagCode.CocosKeelingIslands;
      case "Colombia":
        return CountryFlagCode.Colombia;
      case "Comoros":
        return CountryFlagCode.Comoros;
      case "Congo":
        return CountryFlagCode.Congo;
      case "Congo Democratic Republic":
        return CountryFlagCode.CongoDemocraticRepublic;
      case "Cook Islands":
        return CountryFlagCode.CookIslands;
      case "Costa Rica":
        return CountryFlagCode.CostaRica;
      case "Cote D'Ivoire":
        return CountryFlagCode.CoteDIvoire;
      case "Croatia":
        return CountryFlagCode.Croatia;
      case "Cuba":
        return CountryFlagCode.Cuba;
      case "Curacao":
        return CountryFlagCode.Curacao;
      case "Cyprus":
        return CountryFlagCode.Cyprus;
      case "Czechia":
        return CountryFlagCode.Czechia;
      case "Denmark":
        return CountryFlagCode.Denmark;
      case "Djibouti":
        return CountryFlagCode.Djibouti;
      case "Dominica":
        return CountryFlagCode.Dominica;
      case "Dominican Republic":
        return CountryFlagCode.DominicanRepublic;
      case "Ecuador":
        return CountryFlagCode.Ecuador;
      case "Egypt":
        return CountryFlagCode.Egypt;
      case "El Salvador":
        return CountryFlagCode.ElSalvador;
      case "England":
        return CountryFlagCode.England;
      case "Equatorial Guinea":
        return CountryFlagCode.EquatorialGuinea;
      case "Eritrea":
        return CountryFlagCode.Eritrea;
      case "Estonia":
        return CountryFlagCode.Estonia;
      case "Eswatini":
        return CountryFlagCode.Eswatini;
      case "Ethiopia":
        return CountryFlagCode.Ethiopia;
      case "European Union":
        return CountryFlagCode.EuropeanUnion;
      case "Faroe Islands":
        return CountryFlagCode.FaroeIslands;
      case "Fiji":
        return CountryFlagCode.Fiji;
      case "Finland":
        return CountryFlagCode.Finland;
      case "France":
        return CountryFlagCode.France;
      case "French Guiana":
        return CountryFlagCode.FrenchGuiana;
      case "French Polynesia":
        return CountryFlagCode.FrenchPolynesia;
      case "French Southern Territories":
        return CountryFlagCode.FrenchSouthernTerritories;
      case "Gabon":
        return CountryFlagCode.Gabon;
      case "Gambia":
        return CountryFlagCode.Gambia;
      case "Georgia":
        return CountryFlagCode.Georgia;
      case "Germany":
        return CountryFlagCode.Germany;
      case "Ghana":
        return CountryFlagCode.Ghana;
      case "Gibraltar":
        return CountryFlagCode.Gibraltar;
      case "Greece":
        return CountryFlagCode.Greece;
      case "Greenland":
        return CountryFlagCode.Greenland;
      case "Grenada":
        return CountryFlagCode.Grenada;
      case "Guadeloupe":
        return CountryFlagCode.Guadeloupe;
      case "Guam":
        return CountryFlagCode.Guam;
      case "Guatemala":
        return CountryFlagCode.Guatemala;
      case "Guernsey":
        return CountryFlagCode.Guernsey;
      case "Guinea":
        return CountryFlagCode.Guinea;
      case "Guinea-Bissau":
        return CountryFlagCode.GuineaBissau;
      case "Guyana":
        return CountryFlagCode.Guyana;
      case "Haiti":
        return CountryFlagCode.Haiti;
      case "Heard Island And McDonald Islands":
        return CountryFlagCode.HeardIslandAndMcDonaldIslands;
      case "Holy See":
        return CountryFlagCode.HolySee;
      case "Honduras":
        return CountryFlagCode.Honduras;
      case "Hong Kong":
        return CountryFlagCode.HongKong;
      case "Hungary":
        return CountryFlagCode.Hungary;
      case "Iceland":
        return CountryFlagCode.Iceland;
      case "India":
        return CountryFlagCode.India;
      case "Indonesia":
        return CountryFlagCode.Indonesia;
      case "Iran":
        return CountryFlagCode.Iran;
      case "Iraq":
        return CountryFlagCode.Iraq;
      case "Ireland":
        return CountryFlagCode.Ireland;
      case "Isle Of Man":
        return CountryFlagCode.IsleOfMan;
      case "Israel":
        return CountryFlagCode.Israel;
      case "Italy":
        return CountryFlagCode.Italy;
      case "Jamaica":
        return CountryFlagCode.Jamaica;
      case "Japan":
        return CountryFlagCode.Japan;
      case "Jersey":
        return CountryFlagCode.Jersey;
      case "Jordan":
        return CountryFlagCode.Jordan;
      case "Kazakhstan":
        return CountryFlagCode.Kazakhstan;
      case "Kenya":
        return CountryFlagCode.Kenya;
      case "Kiribati":
        return CountryFlagCode.Kiribati;
      case "Korea North":
        return CountryFlagCode.KoreaNorth;
      case "Korea":
      case "South Korea":
      case "Korea South":
        return CountryFlagCode.KoreaSouth;
      case "Kosovo":
        return CountryFlagCode.Kosovo;
      case "Kuwait":
        return CountryFlagCode.Kuwait;
      case "Kyrgyzstan":
        return CountryFlagCode.Kyrgyzstan;
      case "Laos":
        return CountryFlagCode.Laos;
      case "Latvia":
        return CountryFlagCode.Latvia;
      case "Lebanon":
        return CountryFlagCode.Lebanon;
      case "Lesotho":
        return CountryFlagCode.Lesotho;
      case "Liberia":
        return CountryFlagCode.Liberia;
      case "Libya":
        return CountryFlagCode.Libya;
      case "Liechtenstein":
        return CountryFlagCode.Liechtenstein;
      case "Lithuania":
        return CountryFlagCode.Lithuania;
      case "Luxembourg":
        return CountryFlagCode.Luxembourg;
      case "Macao":
        return CountryFlagCode.Macao;
      case "Madagascar":
        return CountryFlagCode.Madagascar;
      case "Malawi":
        return CountryFlagCode.Malawi;
      case "Malaysia":
        return CountryFlagCode.Malaysia;
      case "Maldives":
        return CountryFlagCode.Maldives;
      case "Mali":
        return CountryFlagCode.Mali;
      case "Malta":
        return CountryFlagCode.Malta;
      case "Marshall Islands":
        return CountryFlagCode.MarshallIslands;
      case "Martinique":
        return CountryFlagCode.Martinique;
      case "Mauritania":
        return CountryFlagCode.Mauritania;
      case "Mauritius":
        return CountryFlagCode.Mauritius;
      case "Mayotte":
        return CountryFlagCode.Mayotte;
      case "Mexico":
        return CountryFlagCode.Mexico;
      case "Micronesia":
        return CountryFlagCode.Micronesia;
      case "Moldova":
        return CountryFlagCode.Moldova;
      case "Monaco":
        return CountryFlagCode.Monaco;
      case "Mongolia":
        return CountryFlagCode.Mongolia;
      case "Montenegro":
        return CountryFlagCode.Montenegro;
      case "Montserrat":
        return CountryFlagCode.Montserrat;
      case "Morocco":
        return CountryFlagCode.Morocco;
      case "Mozambique":
        return CountryFlagCode.Mozambique;
      case "Myanmar":
        return CountryFlagCode.Myanmar;
      case "Namibia":
        return CountryFlagCode.Namibia;
      case "Nauru":
        return CountryFlagCode.Nauru;
      case "Nepal":
        return CountryFlagCode.Nepal;
      case "Netherlands":
        return CountryFlagCode.Netherlands;
      case "Netherlands Antilles":
        return CountryFlagCode.NetherlandsAntilles;
      case "New Caledonia":
        return CountryFlagCode.NewCaledonia;
      case "New York":
        return CountryFlagCode.NewYork;
      case "New Zealand":
        return CountryFlagCode.NewZealand;
      case "Nicaragua":
        return CountryFlagCode.Nicaragua;
      case "Niger":
        return CountryFlagCode.Niger;
      case "Nigeria":
        return CountryFlagCode.Nigeria;
      case "Niue":
        return CountryFlagCode.Niue;
      case "Norfolk Island":
        return CountryFlagCode.NorfolkIsland;
      case "North Macedonia":
        return CountryFlagCode.NorthMacedonia;
      case "Northern Ireland":
        return CountryFlagCode.NorthernIreland;
      case "Northern Mariana Islands":
        return CountryFlagCode.NorthernMarianaIslands;
      case "Norway":
        return CountryFlagCode.Norway;
      case "Oman":
        return CountryFlagCode.Oman;
      case "Pakistan":
        return CountryFlagCode.Pakistan;
      case "Palau":
        return CountryFlagCode.Palau;
      case "Panama":
        return CountryFlagCode.Panama;
      case "Papua New Guinea":
        return CountryFlagCode.PapuaNewGuinea;
      case "Paraguay":
        return CountryFlagCode.Paraguay;
      case "Peru":
        return CountryFlagCode.Peru;
      case "Philippines":
        return CountryFlagCode.Philippines;
      case "Pitcairn":
        return CountryFlagCode.Pitcairn;
      case "Poland":
        return CountryFlagCode.Poland;
      case "Portugal":
        return CountryFlagCode.Portugal;
      case "Puerto Rico":
        return CountryFlagCode.PuertoRico;
      case "Qatar":
        return CountryFlagCode.Qatar;
      case "Reunion":
        return CountryFlagCode.Reunion;
      case "Romania":
        return CountryFlagCode.Romania;
      case "Russia":
        return CountryFlagCode.Russia;
      case "Rwanda":
        return CountryFlagCode.Rwanda;
      case "Saint Barthelemy":
        return CountryFlagCode.SaintBarthelemy;
      case "Saint Helena":
        return CountryFlagCode.SaintHelena;
      case "Saint Kitts And Nevis":
        return CountryFlagCode.SaintKittsAndNevis;
      case "Saint Lucia":
        return CountryFlagCode.SaintLucia;
      case "Saint Martin":
        return CountryFlagCode.SaintMartin;
      case "Saint Pierre And Miquelon":
        return CountryFlagCode.SaintPierreAndMiquelon;
      case "Saint Vincent And Grenadines":
        return CountryFlagCode.SaintVincentAndGrenadines;
      case "Samoa":
        return CountryFlagCode.Samoa;
      case "San Marino":
        return CountryFlagCode.SanMarino;
      case "Sao Tome And Principe":
        return CountryFlagCode.SaoTomeAndPrincipe;
      case "Saudi Arabia":
        return CountryFlagCode.SaudiArabia;
      case "Scotland":
        return CountryFlagCode.Scotland;
      case "Senegal":
        return CountryFlagCode.Senegal;
      case "Serbia":
        return CountryFlagCode.Serbia;
      case "Seychelles":
        return CountryFlagCode.Seychelles;
      case "Sierra Leone":
        return CountryFlagCode.SierraLeone;
      case "Singapore":
        return CountryFlagCode.Singapore;
      case "Sint Maarten":
        return CountryFlagCode.SintMaarten;
      case "Slovakia":
        return CountryFlagCode.Slovakia;
      case "Slovenia":
        return CountryFlagCode.Slovenia;
      case "Solomon Islands":
        return CountryFlagCode.SolomonIslands;
      case "Somalia":
        return CountryFlagCode.Somalia;
      case "South Africa":
        return CountryFlagCode.SouthAfrica;
      case "South Sudan":
        return CountryFlagCode.SouthSudan;
      case "Spain":
        return CountryFlagCode.Spain;
      case "Sri Lanka":
        return CountryFlagCode.SriLanka;
      case "Sudan":
        return CountryFlagCode.Sudan;
      case "Suriname":
        return CountryFlagCode.Suriname;
      case "Svalbard And Jan Mayen":
        return CountryFlagCode.SvalbardAndJanMayen;
      case "Sweden":
        return CountryFlagCode.Sweden;
      case "Switzerland":
        return CountryFlagCode.Switzerland;
      case "Syria":
        return CountryFlagCode.Syria;
      case "Taiwan":
        return CountryFlagCode.Taiwan;
      case "Tajikistan":
        return CountryFlagCode.Tajikistan;
      case "Tanzania":
        return CountryFlagCode.Tanzania;
      case "Thailand":
        return CountryFlagCode.Thailand;
      case "Timor-Leste":
        return CountryFlagCode.TimorLeste;
      case "Togo":
        return CountryFlagCode.Togo;
      case "Tokelau":
        return CountryFlagCode.Tokelau;
      case "Tonga":
        return CountryFlagCode.Tonga;
      case "Trinidad And Tobago":
        return CountryFlagCode.TrinidadAndTobago;
      case "Tunisia":
        return CountryFlagCode.Tunisia;
      case "Turkey":
      case "Türkiye":
        return CountryFlagCode.Turkey;
      case "Turkmenistan":
        return CountryFlagCode.Turkmenistan;
      case "Turks And Caicos Islands":
        return CountryFlagCode.TurksAndCaicosIslands;
      case "Tuvalu":
        return CountryFlagCode.Tuvalu;
      case "Uganda":
        return CountryFlagCode.Uganda;
      case "Ukraine":
        return CountryFlagCode.Ukraine;
      case "United Arab Emirates":
        return CountryFlagCode.UnitedArabEmirates;
      case "United Kingdom":
      case "Great Britan":
        return CountryFlagCode.UnitedKingdom;
      case "United States":
      case "USA":
      case "US":
        return CountryFlagCode.UnitedStates;
      case "United States Minor Outlying Islands":
        return CountryFlagCode.UnitedStatesMinorOutlyingIslands;
      case "Uruguay":
        return CountryFlagCode.Uruguay;
      case "US Virgin Islands":
        return CountryFlagCode.USVirginIslands;
      case "Uzbekistan":
        return CountryFlagCode.Uzbekistan;
      case "Vanuatu":
        return CountryFlagCode.Vanuatu;
      case "Vatican City":
        return CountryFlagCode.VaticanCity;
      case "Venezuela":
        return CountryFlagCode.Venezuela;
      case "Vietnam":
        return CountryFlagCode.Vietnam;
      case "Wales":
        return CountryFlagCode.Wales;
      case "Wallis And Futuna":
        return CountryFlagCode.WallisAndFutuna;
      case "Western Sahara":
        return CountryFlagCode.WesternSahara;
      case "Yemen":
        return CountryFlagCode.Yemen;
      case "Zambia":
        return CountryFlagCode.Zambia;
      case "Zimbabwe":
        return CountryFlagCode.Zimbabwe;
      default:
        return undefined;
    }
  })();

  if (countryName === "West Indies") {
    return "/cricket/west-indies.svg";
  }
  if (countryName === "Chinese Taipei") {
    return "https://upload.wikimedia.org/wikipedia/commons/3/3a/Flag_of_Chinese_Taipei_variant.svg";
  }

  return getCountryImageUrl(countryCode);
}
