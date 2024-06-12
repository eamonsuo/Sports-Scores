export default async function APIStatus({ data }: { data: APISportsStatus }) {
  return (
    <div className="m-1">{`API Calls: ${data.requests.current} out of ${data.requests.limit_day}`}</div>
  );
}
