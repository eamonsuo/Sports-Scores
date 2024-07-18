import { NFLGame } from "@/types/nfl";
import Image from "next/image";

export default function NFLScoreBreakdown({
  data,
  homeLogo,
  awayLogo,
}: {
  data: NFLGame;
  homeLogo: string;
  awayLogo: string;
}) {
  let OTFLAG = false;
  if (data.scores.home.overtime !== null) {
    OTFLAG = true;
  }
  return (
    <table className="m-4 text-center">
      <thead>
        <tr>
          <th></th>
          <th>Q1</th>
          <th>Q2</th>
          <th>Q3</th>
          <th>Q4</th>
          {OTFLAG && <th>OT</th>}
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Image src={homeLogo} width={15} height={15} alt="Home Logo" />
          </td>
          <td>{data.scores.home.quarter_1}</td>
          <td>{data.scores.home.quarter_2}</td>
          <td>{data.scores.home.quarter_3}</td>
          <td>{data.scores.home.quarter_4}</td>
          {OTFLAG && <td>{data.scores.home.overtime}</td>}
          <td>{data.scores.home.total}</td>
        </tr>
        <tr>
          <td>
            <Image src={awayLogo} width={15} height={15} alt="Away Logo" />
          </td>
          <td>{data.scores.away.quarter_1}</td>
          <td>{data.scores.away.quarter_2}</td>
          <td>{data.scores.away.quarter_3}</td>
          <td>{data.scores.away.quarter_4}</td>
          {OTFLAG && <td>{data.scores.away.overtime}</td>}
          <td>{data.scores.away.total}</td>
        </tr>
      </tbody>
    </table>
  );
}
