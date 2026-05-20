import Ladder from "@/components/all-sports/Ladder"
import Placeholder from "@/components/misc-ui/Placeholder"
import { f1Service } from "@/services/f1.service"

export default async function Page(props: {
  params: Promise<{ season: string }>
}) {
  const { season } = await props.params
  const pageData = await f1Service.standingsDrivers(season)

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {pageData.standings.map((table, index) => (
        <Ladder
          key={index}
          data={table.data}
          headings={table.headings}
          placingCategories={table.placingCategories}
        />
      ))}
    </div>
  )
}
