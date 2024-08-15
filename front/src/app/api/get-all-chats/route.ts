// app/api/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const page = request.url.split("?")[1].split("=")[1]
  const response = await fetch(`http://localhost:8080/movies/filter?page=${page}`);

  return new Response(JSON.stringify(await response.json()), {
    status: response.status,
  });
}
