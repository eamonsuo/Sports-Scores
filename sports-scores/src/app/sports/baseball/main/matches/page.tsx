import { fetchBaseballFixtures } from "@/api/baseball.api";
import FixtureList from "@/components/generic/FixtureList";
import Placeholder from "@/components/misc/Placeholder";
import { mapBaseballFixtureFields } from "@/lib/dataMapping";

export default async function Page() {
  const fixtures = await fetchBaseballFixtures(2024);

  if (typeof fixtures === "string") {
    return <Placeholder>{fixtures}</Placeholder>;
  }

  const mappedFixtures = mapBaseballFixtureFields(fixtures);

  return <FixtureList data={mappedFixtures} />;
}
