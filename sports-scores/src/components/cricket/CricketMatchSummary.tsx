export default function CricketMatchSummary({
  date,
  venue,
  toss,
  homePlayers,
  awayPlayers,
  umpires,
  pom,
}: {
  date: string;
  venue: string;
  toss: string;
  homePlayers: string[];
  awayPlayers: string[];
  umpires: string[];
  pom: string;
}) {
  return (
    <table className="m-4 dark:text-neutral-500">
      <tbody>
        <tr>
          <td>Date</td>
          <td className="py-1 text-sm">{date}</td>
        </tr>
        <tr>
          <td>Venue</td>
          <td className="py-1 text-sm">{venue}</td>
        </tr>
        <tr>
          <td>Toss</td>
          <td className="py-1 text-sm">{toss}</td>
        </tr>
        <tr>
          <td>Home Team</td>
          <td className="py-1 text-xs">{homePlayers}</td>
        </tr>
        <tr>
          <td>Away Team</td>
          <td className="py-1 text-xs">{awayPlayers}</td>
        </tr>
        <tr>
          <td>Umpires</td>
          <td className="py-1 text-sm">{umpires}</td>
        </tr>
        <tr>
          <td>P.O.M.</td>
          <td className="py-1 text-sm">{pom}</td>
        </tr>
      </tbody>
    </table>
  );
}
