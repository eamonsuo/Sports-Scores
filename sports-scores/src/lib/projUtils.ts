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

export function getCountryImageUrl(countryCode: CountryFlagCode) {
  if (
    countryCode === null ||
    countryCode === undefined ||
    countryCode === "/vercel.svg"
  ) {
    return "/vercel.svg";
  }

  return `https://flagsapi.com/${countryCode}/flat/64.png`;
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
  var countryCode: CountryFlagCode = (() => {
    switch (playerName) {
      // Australia (AU)
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
        return "AU";

      // United States (US)
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
        return "US";

      // United Kingdom (GB)
      case "Rory McIlroy": // Northern Ireland
      case "Tommy Fleetwood":
      case "Justin Rose":
      case "Tyrrell Hatton":
      case "Robert MacIntyre": // Scotland
      case "Aaron Rai":
        return "GB";

      // Sweden (SE)
      case "Ludvig Åberg":
        return "SE";

      // Japan (JP)
      case "Hideki Matsuyama":
        return "JP";

      // Norway (NO)
      case "Viktor Hovland":
        return "NO";

      // Ireland (IE)
      case "Shane Lowry":
        return "IE";

      // Austria (AT)
      case "Sepp Straka":
        return "AT";

      // South Korea (KR)
      case "Sungjae Im":
      case "Tom Kim":
        return "KR";

      // Canada (CA)
      case "Corey Conners":
        return "CA";

      // Spain (ES)
      case "Sergio Garcia":
      case "Jon Rahm":
        return "ES";

      //Chilie (CL)
      case "Joaquin Niemann":
        return "CL";

      // Japan (JP)
      case "Hideki Matsuyama":
        return "JP";

      // South Africa (ZA)
      case "Louis Oosthuizen":
      case "Branden Grace":
      case "Charl Schwartzel":
        return "ZA";

      //Belgium (BE)
      case "Thomas Pieters":
      case "Thomas Detry":
        return "BE";

      default:
        return "/vercel.svg";
    }
  })();

  return getCountryImageUrl(countryCode);

  switch (playerName) {
    default:
      return "";
  }
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
  var countryCode: CountryFlagCode = (() => {
    switch (name) {
      case "Australian Grand Prix":
      case "Oscar Piastri":
      case "Jack Doohan":
        return "AU";
      case "Bahrain Grand Prix":
        return "BH";
      case "Chinese Grand Prix":
        return "CN";
      case "Azerbaijan Grand Prix":
        return "AZ";
      case "Emilia Romagna Grand Prix":
      case "Italian Grand Prix":
      case "Andrea Kimi Antonelli":
        return "IT";
      case "Monaco Grand Prix":
      case "Charles Leclerc":
        return "MC";
      case "Spanish Grand Prix":
      case "Carlos Sainz":
      case "Fernando Alonso":
        return "ES";
      case "Canadian Grand Prix":
      case "Lance Stroll":
        return "CA";
      case "Austrian Grand Prix":
        return "AT";
      case "British Grand Prix":
      case "Lando Norris":
      case "George Russell":
      case "Lewis Hamilton":
      case "Oliver Bearman":
        return "GB";
      case "Hungarian Grand Prix":
        return "HU";
      case "Belgian Grand Prix":
        return "BE";
      case "Dutch Grand Prix":
      case "Max Verstappen":
        return "NL";
      case "Singapore Grand Prix":
        return "SG";
      case "Japanese Grand Prix":
      case "Yuki Tsunoda":
        return "JP";
      case "Qatar Grand Prix":
        return "QA";
      case "Miami Grand Prix":
      case "United States Grand Prix":
      case "Las Vegas Grand Prix":
        return "US";
      case "Mexico City Grand Prix":
        return "MX";
      case "São Paulo Grand Prix":
      case "Gabriel Bortoleto":
        return "BR";
      case "Saudi Arabian Grand Prix":
        return "SA";
      case "Abu Dhabi Grand Prix":
        return "AE";
      case "Alexander Albon":
        return "TH";
      case "Nico Hülkenberg":
        return "DE";
      case "Liam Lawson":
        return "NZ";
      case "Esteban Ocon":
      case "Pierre Gasly":
      case "Isack Hadjar":
        return "FR";
      default:
        return "/vercel.svg";
    }
  })();

  return getCountryImageUrl(countryCode);
}

export function resolveF1TeamImages(teamName: string) {
  switch (teamName) {
    case "Red Bull":
      return "/f1/redbull.png";
    case "Mercedes":
      return "/f1/mercedes.png";
    case "Ferrari":
      return "/f1/ferrari.svg";
    case "McLaren":
      return "/f1/mclaren.png";
    case "Alpine F1 Team":
      return "/f1/alpine.png";
    case "Aston Martin":
      return "/f1/astonmartin.svg";
    case "RB F1 Team":
      return "/f1/rb.webp";
    case "Sauber":
      return "/f1/sauber.webp";
    case "Haas F1 Team":
      return "/f1/haas.png";
    case "Williams":
      return "/f1/williams.webp";
    default:
      return "/vercel.svg";
  }
}
