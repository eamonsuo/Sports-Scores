interface APISportsAflGames {
    get: string,
    parameters: {
        season: string,
        league: string
    },
    errors: string[],
    results: number,
    response: APISportsMatchResponseAfl[]
}

type APISportsMatchResponseAfl = {
    game: {
        id: number
    },
    league: {
        id: number,
        season: number
    },
    date: string,
    time: string,
    timestamp: string,
    timezone: string,
    round: string,
    week: number,
    venue: string,
    attendance?: number,
    status: {
        long: "Not Started" | "1st Quarter" | "2nd Quarter" | "3rd Quarter" | "4th Quarter" | 
            "Quarter Time" | "End Of Regulation" | "Full Time" | "Half Time" | "Cancelled" | "Postponed",
        short: "NS" | "Q1" | "Q2" | "Q3" | "Q4" | "QT" | "ER" | "FT" | "HT" | "CANC" | "PST"
    },
    teams: {
        home: {
            id: number,
            name: string,
            logo: string
        },
        away: {
            id: number,
            name: string,
            logo: string
        }
    },
    scores: {
        home: {
            score: number,
            goals: number,
            behinds: number,
            psgoals: number,
            psbehinds: number
        },
        away: {
            score: number,
            goals: number,
            behinds: number,
            psgoals: number,
            psbehinds: number
        }
    }
}

type NavButtonGroupProps = {
    label: string,
    link: string
}[]

type ScoreSummaryCardProps = {
    matchDetails: MatchDetails,
    homeDetails: TeamScoreDetails,
    awayDetails: TeamScoreDetails
}

type MatchDetails = {
    venue: string,
    status: string,
    summary: string,
    otherDetail: string 
}

type TeamScoreDetails = {
    img: string,
    score: string,
    name: string
}

type MatchSummary = {
    id: number,
    startDate: string,
    details: ScoreSummaryCardProps
}