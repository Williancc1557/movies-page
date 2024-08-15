import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const title = request.url.split("?")[1].split("=")[1];
  const response = await fetch(
    `http://localhost:8080/movies/title/search/${title}`
  );

  return new Response(JSON.stringify(await response.json()), {
    status: response.status,
  });
}
