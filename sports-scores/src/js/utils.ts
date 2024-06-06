export function setMatchStatusCricket(status: string) {
    switch (status) {
        case 'Aban.':
            return "Abandoned";
        case 'NS':
            return "Upcoming";
        default:
            return status;
    }
}

export function calculateAFLMatchResult(homeName:string, homeScore: number, awayName:string, awayScore: number) {
    let winningTeam: string = "";
    let winningMargin: number;

    if (homeScore > awayScore) {
        winningMargin = homeScore - awayScore;
        winningTeam = homeName;
    } else if (homeScore < awayScore) {
        winningMargin = awayScore - homeScore;
        winningTeam = awayName;
    } else {
        winningMargin = 0;
    }
    // console.log(homeScore, awayScore);

    return winningMargin == 0 ? "Match Drawn" : `${winningTeam} won by ${winningMargin}`;
}