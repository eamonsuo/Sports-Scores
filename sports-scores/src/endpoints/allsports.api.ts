export async function fetchAllsportsApi(endpoint: string) {
  const url = process.env.ALLSPORTS_BASEURL + endpoint
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  })

  if (!res.ok || res.status === 204) {
    return null
  }

  return res.json()
}
