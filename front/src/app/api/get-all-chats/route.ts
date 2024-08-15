// app/api/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const response = await fetch(`http://localhost:8080/movies/filter?page=2`);

  return new Response(JSON.stringify(await response.json()), {
    status: response.status,
  });
}
