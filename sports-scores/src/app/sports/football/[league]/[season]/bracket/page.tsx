import Match from "@/components/bracket/components/match";
import FlexibleSingleEliminationBracket from "@/components/bracket/FlexibleSingleEliminationBracket";
import Placeholder from "@/components/misc/Placeholder";
import { footballBrackets } from "@/services/football.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await footballBrackets(Number(league), Number(season));
  // await pageData = fetch(
  //   `https://www.sofascore.com/api/v1/unique-tournament/19/season/67958/cuptrees`,
  // );
  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  console.log("📖 Page data:", pageData);
  console.log("Brackets count:", pageData.brackets.length);
  console.log("Total matches:", pageData.brackets[0]?.matches.length);

  return (
    <div className="flex flex-col overflow-x-auto overflow-y-auto">
      {pageData.brackets.map((bracket) => (
        <FlexibleSingleEliminationBracket
          key={bracket.id}
          matches={bracket.matches}
          matchComponent={Match}
        />
      ))}
    </div>
  );
}
//   return (
//     <>
//       <FlexibleSingleEliminationBracket
//         svgWrapper={({ children, ...props }) => (
//           <SVGViewer width={500} height={500} {...props}>
//             {children}
//           </SVGViewer>
//         )}
//         matchComponent={Match}
//         matches={fiveTeamBracket}
//       />
//       {/* {pageData.brackets.map((bracket) => (
//         <div key={bracket.name} className="h-full overflow-y-auto p-4">
//           <h2 className="mb-4 text-center text-xl font-bold">{bracket.name}</h2>
//           <div className="mb-4 flex overflow-x-auto">
//             {bracket.rounds.map((round) => (
//               <div className="flex min-w-fit items-center justify-center rounded-md border p-1 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-400 dark:active:bg-neutral-700">
//                 {round.name}
//               </div>
//             ))}
//           </div>
//           <Carousel className="">
//             <CarouselContent>
//               {bracket.rounds.map((round) => (
//                 <div key={round.id}>
//                   <CarouselItem className="">
//                     {round.matches.map((match) => (
//                       <div
//                         key={match.id}
//                         className="flex items-center justify-center rounded-md border border-gray-300 p-4 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-400 dark:active:bg-neutral-700"
//                       >
//                         <div className="flex w-full">
//                           <div className="flex w-full flex-col truncate">
//                             <span className="">{match.homeDetails.name}</span>
//                             <span className=" ">{match.awayDetails.name}</span>
//                           </div>
//                           <div className="ms-2 flex min-w-fit flex-col">
//                             <span className="text-center">
//                               {match.homeDetails.score}
//                             </span>
//                             <span className="text-center">
//                               {match.awayDetails.score}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </CarouselItem>
//                 </div>
//               ))}
//             </CarouselContent>
//           </Carousel>
//         </div>
//       ))} */}
//     </>
//   );
