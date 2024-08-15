// app/api/get-all-chats/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1"; // Padrão para 1 se não especificado
  const title = url.searchParams.get("title") || ""; // Padrão para vazio se não especificado
  const genre = url.searchParams.get("genre") || ""; // Padrão para vazio se não especificado

  const queryParams = new URLSearchParams();
  queryParams.append("page", page);
  if (title) {
    queryParams.append("title", title);
  }

  if (genre) {
    queryParams.append("genre", genre);
  }

  const response = await fetch(
    `http://localhost:8080/movies/filter?${queryParams.toString()}`
  );

  return new Response(JSON.stringify(await response.json()), {
    status: response.status,
  });
}
