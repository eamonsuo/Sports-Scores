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