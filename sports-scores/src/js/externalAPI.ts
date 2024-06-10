import { SPORT } from "@/js/constants"
import { setAFLMatchSummary } from "./utils";

const REVALIDATE = 10000; //TODO: change for deployment

export async function fetchAflData(type: string) {
    const reqHeaders: Headers = new Headers();
    reqHeaders.append("x-apisports-key", `${process.env.APISportsKey}`);

    const fetchOptions = {headers: reqHeaders, next: {revalidate: REVALIDATE}};
    
    let returnValue;

    switch (type) {
        case "fixtures":
            const rawFixtures = await fetch(`${process.env.AFL_BASEURL}/games?season=2024&league=1`, fetchOptions);
            returnValue = await rawFixtures.json();
            break;
        case "status":
            const rawStatus = await fetch(`${process.env.AFL_BASEURL}/status`, fetchOptions);
            returnValue = await rawStatus.json();
            break;
        case "standings":
            const rawStandings = await fetch(`${process.env.AFL_BASEURL}/standings?season=2024&league=1`, fetchOptions);
            returnValue = await rawStandings.json();
            break;
    }     

    return returnValue;
}

export async function fetchSportSummaryData(sport: string): Promise<MatchSummary[]> {
    
    let returnValue: MatchSummary[] = [];

    switch (sport) {
        case SPORT.AFL:
            const rawFixtures = await fetchAflData("fixtures");
            returnValue = mapAflFixtureFields(rawFixtures.response);            
            break;
    }

     

    return returnValue;
}

function mapAflFixtureFields(matches: APISportsMatchResponseAfl[]): MatchSummary[] {
    return matches.map((item: APISportsMatchResponseAfl) => 
        ({
            id: item.game.id, 
            startDate: item.date, 
            details: {
                matchDetails: {
                    venue: item.venue,
                    status: item.status.long,
                    summary: setAFLMatchSummary(item.status.short, item.date, item.teams.home.name, item.scores.home.score, item.teams.away.name, item.scores.away.score),
                    otherDetail: item.round 
                }, 
                homeDetails: {
                    img: item.teams.home.logo,
                    score: item.scores.home.score.toString(),
                    name: item.teams.home.name
                }, 
                awayDetails: {
                    img: item.teams.away.logo,
                    score: item.scores.away.score.toString(),
                    name: item.teams.away.name
                }
            }
        })
    );
}