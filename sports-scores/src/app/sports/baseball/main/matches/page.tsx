import { fetchBaseballFixtures } from "@/api/baseball.api";
import FixtureList from "@/components/generic/FixtureList";
import { mapBaseballFixtureFields } from "@/lib/dataMapping";
import { redirect } from "next/navigation";

export default async function Page() {
  const fixtures = await fetchBaseballFixtures(2024);

  if (fixtures === null) {
    redirect("/misc/apiError");
  }

  const mappedFixtures = mapBaseballFixtureFields(fixtures);

  return <FixtureList data={mappedFixtures} />;
}
