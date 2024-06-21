import Image from "next/image";

export default function MatchDetailsHero({ data }: { data: MatchSummary }) {
  return (
    <div className="m-4 grid grid-cols-3 gap-2">
      <div className="content-center justify-self-center">
        <Image
          src={data.homeDetails.img}
          width={60}
          height={60}
          alt="Home team image"
        />
      </div>
      <div></div>

      <div className="content-center justify-self-center">
        <Image
          src={data.awayDetails.img}
          width={40}
          height={40}
          alt="Away team image"
        />
      </div>

      <p className="text-center text-gray-700">{data.homeDetails.name}</p>
      <div className="text-center">{data.status}</div>
      <p className="text-center text-gray-700">{data.awayDetails.name}</p>
      <p className="content-center text-center text-2xl text-black">
        {data.homeDetails.score}
      </p>
      <div></div>
      <p className="content-center text-center text-2xl text-black">
        {data.awayDetails.score}
      </p>
    </div>
  );
}
