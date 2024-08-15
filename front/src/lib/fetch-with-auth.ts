import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const fetchWithAuth = async (
  input: string | URL | Request,
  init?: RequestInit
) => {
  const response = await fetch(input, {
    ...init,
    headers: {
      Authorization: cookies().get("accessToken")?.value || "",
    },
  });

  if (response.status != 401) return response;

  const refreshToken = cookies().get("refreshToken")?.value || "";

  const refreshTokenRequestResponse = await fetch(
    process.env.AUTH_URL! + "/api/auth/refresh-token",
    {
      headers: {
        refreshtoken: refreshToken,
      },
    }
  );

  if (refreshTokenRequestResponse.status >= 400) {
    cookies().delete("refreshToken");
    cookies().delete("accessToken");
    redirect("/auth/sign-in");
  }

  cookies().set(
    "accessToken",
    (await refreshTokenRequestResponse.json()).accessToken
  );

  return await fetch(input, {
    ...init,
    headers: {
      Authorization: cookies().get("accessToken")?.value || "",
    },
  });
};
