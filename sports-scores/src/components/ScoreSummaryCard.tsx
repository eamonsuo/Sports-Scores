import Image from 'next/image';

export default function ScoreSummaryCard({matchDetails, homeDetails, awayDetails}: any) {
    // console.log(matchDetails);
    return (
        <div className="border border-gray-300 min-h-[100px] flex flex-col mt-4 items-center justify-center p-4">
            <p className="text-gray-700 text-xs">{matchDetails?.status}</p>
            <p className="text-gray-500 text-center">{matchDetails?.summary}</p>
            
            <div className='grid grid-cols-5 gap-2 mt-2'>
                <div className=' content-center border border-gray-100'><Image src={homeDetails?.img} width={48} height={48} alt="Home team image"/></div>
                <p className=" text-black content-center">{homeDetails?.score}</p>
                <div></div>
                <p className="text-black text-right content-center">{awayDetails?.score}</p>
                <div className='content-center border border-gray-100'><Image src={awayDetails?.img} width={48} height={48} alt="Away team image"/></div>
                <p className="text-left	col-span-2 text-gray-700">{homeDetails?.name}</p>
                <div></div>
                <p className="text-right col-span-2 text-gray-700">{awayDetails?.name}</p> 
            </div>
            
            {/* <div className="flex space-x-16">
                <div className="flex flex-col">
                    <div className="flex items-center">
                        <Image src={homeDetails?.img} width={48} height={48} alt="Home team image" />
                        <span className=" text-gray-700">{homeDetails?.score}</span>
                    </div>
                    
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center">
                        <span className="text-gray-700">{awayDetails?.score}</span>
                        <Image src={awayDetails?.img} width={48} height={48} alt="Away team image" />
                    </div>
                    <p className="text-right text-gray-500">{awayDetails?.name}</p> 
                </div>
            </div> */}
            <p className="text-gray-500 text-xs text-center mt-2">{matchDetails?.otherDetail}</p>
            <p className="text-gray-500 text-xs text-center">{matchDetails?.venue}</p>
        </div>
    );
}
