"use client";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();

  return (
    <nav className="flex justify-between pt-4 pb-4 align-middle font-bossa-regular border-b border-[#ffffff23]">
      <div className="flex items-center h-full">
        <span className="mx-10 text-xl font-semibold">
          <button>FILMS EDITOR</button>
        </span>
        <div className="flex h-full gap-6 items-center [&_li]:h-full [&_li]:flex hover:[&_li_button]:text-blue-600 justify-center">
          <li className="h-full flex">
            <button>Home</button>
          </li>
          <li className="h-full flex">
            <button>Docs</button>
          </li>
          <li className="h-full flex">
            <button>Support</button>
          </li>
        </div>
      </div>
      <div className="flex mx-10 gap-6 hover:[&_button]:text-blue-600">
        <button onClick={() => router.push("/auth/sign-in")}>Sign In</button>
        <button onClick={() => router.push("/auth/sign-up")}>Try Free</button>
      </div>
    </nav>
  );
};
