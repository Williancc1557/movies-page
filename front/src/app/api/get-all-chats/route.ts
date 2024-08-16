// app/api/get-all-chats/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1"; // Padrão para 1 se não especificado
  const title = url.searchParams.get("title") || "";
  const genre = url.searchParams.get("genre") || "";
  const year = url.searchParams.get("year") || "";

  const queryParams = new URLSearchParams();
  queryParams.append("page", page);
  if (title) {
    queryParams.append("title", title);
  }

  if (genre) {
    queryParams.append("genre", genre);
  }

  if (year) {
    queryParams.append("year", year);
  }

  const response = await fetch(
    `https://testb-nf4udowr6q-uc.a.run.app/movies/filter?${queryParams.toString()}`
  );

  console.log(response);

  return new Response(JSON.stringify(await response.json()), {
    status: response.status,
  });
}
