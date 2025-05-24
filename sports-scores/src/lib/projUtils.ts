import {
  APISportsErrors,
  APISportsResponse,
  CountryFlagCode,
  MatchSummary,
} from "@/types/misc";
import { MATCHSTATUSAFL, MATCHSTATUSNFL } from "./constants";

export function setMatchStatusCricket(status: string) {
  switch (status) {
    case "Aban.":
      return "Abandoned";
    case "NS":
      return "Upcoming";
    default:
      return status;
  }
}

export function calculateMatchResult(
  homeName: string,
  homeScore: number,
  awayName: string,
  awayScore: number,
  finished: boolean,
) {
  let winningTeam: string = "";
  let winningMargin: number;
  let description: string = "";

  finished ? (description = "won by") : (description = "lead by");

  if (homeScore > awayScore) {
    winningMargin = homeScore - awayScore;
    winningTeam = homeName;
  } else if (homeScore < awayScore) {
    winningMargin = awayScore - homeScore;
    winningTeam = awayName;
  } else {
    winningMargin = 0;
  }

  return winningMargin == 0
    ? "Match Drawn"
    : `${winningTeam} ${description} ${winningMargin}`;
}

export function setMatchSummary(
  status: string,
  startTime: string,
  homeName: string,
  homeScore: number,
  awayName: string,
  awayScore: number,
) {
  switch (status) {
    case "notstarted":
    case MATCHSTATUSAFL.SHORT_NS:
    case MATCHSTATUSNFL.SHORT_NS:
      return ``;
    case MATCHSTATUSAFL.SHORT_FT:
    case MATCHSTATUSNFL.SHORT_FT:
    case MATCHSTATUSNFL.SHORT_AOT:
    case "finished":
      return calculateMatchResult(
        homeName,
        homeScore,
        awayName,
        awayScore,
        true,
      );
    case MATCHSTATUSAFL.SHORT_CANC:
    case MATCHSTATUSNFL.SHORT_CANC:
      return "Match Cancelled";
    case MATCHSTATUSAFL.SHORT_PST:
    case MATCHSTATUSNFL.SHORT_PST:
      return "Match Postponed";
    default:
      return calculateMatchResult(
        homeName,
        homeScore,
        awayName,
        awayScore,
        false,
      );
  }
}

export function getCurrentWeek(data: MatchSummary[]) {
  let curDate = new Date(Date.now());
  curDate.setHours(0, 0, 0, 0);

  let record = data.find((item) => {
    let itemDate = new Date(item.startDate);
    itemDate.setHours(0, 0, 0, 0);
    return itemDate >= curDate;
  });

  return record?.roundLabel ?? data[data.length - 1].roundLabel ?? "";
}

export function toShortTimeString(date: Date) {
  return date
    .toLocaleTimeString("en-US", {
      timeZone: "Australia/Brisbane",
    })
    .replace(":00 ", " ");
}

//Convert to AEST
//startTime format: hh:mm
export function getLocalTime(startTime: string) {
  let splitTime = startTime.split(":");
  let tempDate = new Date(
    Date.UTC(0, 0, 0, Number(splitTime[0]), Number(splitTime[1])),
  );
  return tempDate
    .toLocaleTimeString("en-US", {
      timeZone: "Australia/Brisbane",
    })
    .replace(":00 ", " ");
}

//Convert to AEST
//startTime format: yyyy-mm-ddThh:mm:ss.sssZ
export function getLocalTimeISO(startTime: string) {
  // let splitTime = startTime.split(":");
  let tempDate = new Date(startTime);
  return tempDate
    .toLocaleTimeString("en-US", {
      timeZone: "Australia/Brisbane",
    })
    .replace(":00 ", " ");
}

export function getCountryImageUrl(countryCode?: CountryFlagCode) {
  if (countryCode === null || countryCode === undefined) {
    return "/vercel.svg";
  }

  return `https://flagcdn.com/${countryCode}.svg`;
}

export function shortenTeamNames(team: string) {
  switch (team) {
    //AFL
    case "Greater Western Sydney Giants":
      return "GWS Giants";
    case "North Melbourne Kangaroos":
      return "North Melbourne";
    //NFL
    case "Washington Commanders":
      return "Washington Comm.";
    case "Tampa Bay Buccaneers":
      return "Tampa Bay Buccs";
    case "Los Angeles Chargers":
      return "LA Chargers";
    //NRL
    case "North Queensland Cowboys":
      return "North QLD Cowboys";
    case "St. George Illawarra Dragons":
      return "St George Illawarra";
    case "South Sydney Rabbitohs":
      return "South Sydney Rabbits";
    case "New Zealand Warriors":
      return "NZ Warriors";
    default:
      return team;
  }
}

export function handleAPIErrors(response: APISportsResponse) {
  if ((response.errors as any[]).length === undefined) {
    return (
      (response.errors as APISportsErrors).rateLimit ??
      (response.errors as APISportsErrors).requests ??
      (response.errors as APISportsErrors).token ??
      "Unknown error"
    );
  }
  return "No Results";
}

export function dateToCustomString(date: Date) {
  return date
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "Australia/Brisbane",
    })
    .replaceAll(",", "");
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
        return CountryFlagCode.UnitedStates;

      case "Tommy Fleetwood":
      case "Justin Rose":
      case "Tyrrell Hatton":
      case "Aaron Rai":
      case "Matt Fitzpatrick":
        return CountryFlagCode.England;

      case "Shane Lowry":
        return CountryFlagCode.Ireland;
      case "Rory McIlroy":
        return CountryFlagCode.NorthernIreland;
      case "Robert MacIntyre":
        return CountryFlagCode.Scotland;

      case "Ludvig Åberg":
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
        return CountryFlagCode.KoreaSouth;

      case "Corey Conners":
        return CountryFlagCode.Canada;

      case "Sergio Garcia":
      case "Jon Rahm":
      case "David Puig":
        return CountryFlagCode.Spain;

      case "Joaquin Niemann":
        return CountryFlagCode.Chile;

      case "Louis Oosthuizen":
      case "Branden Grace":
      case "Charl Schwartzel":
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
        return CountryFlagCode.Mexico;
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
      return "/vercel.svg";
  }
}

export function resolveAFLImages(teamName: string) {
  switch (teamName) {
    case "Adelaide Crows":
      return "/afl/crows.svg";
    case "Brisbane Lions":
      return "/afl/lions.svg";
    case "Carlton Blues":
      return "/afl/blues.svg";
    case "Collingwood Magpies":
      return "/afl/magpies.svg";
    case "Essendon Bombers":
      return "/afl/bombers.svg";
    case "Fremantle Dockers":
      return "/afl/dockers.svg";
    case "Geelong Cats":
      return "/afl/cats.svg";
    case "Gold Coast Suns":
      return "/afl/suns.svg";
    case "GWS Giants":
      return "/afl/giants.svg";
    case "Hawthorn Hawks":
      return "/afl/hawks.svg";
    case "Melbourne Demons":
      return "/afl/demons.svg";
    case "North Melbourne":
      return "/afl/kangaroos.svg";
    case "Port Adelaide Power":
      return "/afl/power.svg";
    case "Richmond Tigers":
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
      return "/vercel.svg";
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
      return "/vercel.svg";
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
      return "/vercel.svg";
  }
}
