import { connection } from "next/server";

export async function POST(request: Request) {
  await connection();

  const dataSharingEndpoint = process.env.DATA_SHARING_ENDPOINT;
  if (!dataSharingEndpoint) {
    return new Response(`Environment variable DATA_SHARING_ENDPOINT not set, skipping event creation`, {
      status: 200,
    });
  }

  const eventData = await request.text();
  const response = await fetch(dataSharingEndpoint + "/events", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: eventData,
  });

  const data = await response.text();
  return new Response(data);
}
