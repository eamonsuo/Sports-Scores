import Image from "next/image";

export default function ScoreDetails({
  gameData,
  quarterData,
}: {
  gameData: AFLGame;
  quarterData: AFLGameQuarters;
}) {
  return (
    <>
      {/* Hero Score Banner */}
      <div className="m-4 grid grid-cols-3 gap-2">
        <div className="content-center justify-self-center">
          <Image
            src={gameData.teams.home.logo}
            width={60}
            height={60}
            alt="Home team image"
          />
        </div>
        <div></div>

        <div className="content-center justify-self-center">
          <Image
            src={gameData.teams.away.logo}
            width={40}
            height={40}
            alt="Away team image"
          />
        </div>

        <p className="text-center text-gray-700">{gameData.teams.home.name}</p>
        <div className="text-center">{gameData.status.long}</div>
        <p className="text-center text-gray-700">{gameData.teams.away.name}</p>
        <p className="content-center text-center text-2xl text-black">
          {gameData.scores.home.score}
        </p>
        <div></div>
        <p className="content-center text-center text-2xl text-black">
          {gameData.scores.away.score}
        </p>
      </div>

      {/* Table of G.B. */}
      <table className="m-4 w-full text-center">
        <thead>
          <tr>
            <th></th>
            <th>Q1</th>
            <th>Q2</th>
            <th>Q3</th>
            <th>Q4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Image
                src={gameData.teams.home.logo}
                width={15}
                height={15}
                alt="Home Logo"
              />
            </td>
            {quarterData.quarters.map((item) => (
              <td key={item.quarter}>
                {item.teams.home.goals}.{item.teams.home.behinds}
              </td>
            ))}
          </tr>
          <tr>
            <td>
              <Image
                src={gameData.teams.away.logo}
                width={15}
                height={15}
                alt="Away Logo"
              />
            </td>
            {quarterData.quarters.map((item) => (
              <td key={item.quarter}>
                {item.teams.away.goals}.{item.teams.away.behinds}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
}
