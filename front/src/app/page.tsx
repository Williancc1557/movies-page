"use client";

import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState({} as any);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/get-all-chats?a=b", {
        method: "GET",
      });
      setMovies(await response.json());
    };

    fetchData();
  }, [setMovies]);

  console.log(movies)

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="m-10">
        <p className="mb-2">Filters:</p>
        <div className="flex w-60 gap-4 flex-col">
          <Input type="text" placeholder="Year"/>
          <Input type="text" placeholder="Year"/>
        </div>
        <div className="flex flex-col w-full mt-10">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 items-center gap-5">
              {
                movies?.results?.map((movie: any) => (
                  <div key={movie.id}>
                    <Card className="h-72">
                      <CardHeader>
                        <CardTitle>{movie.originalTitleText.text}</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Card Content</p>
                      </CardContent>
                      <CardFooter>
                        <p>Card Footer</p>
                      </CardFooter>
                    </Card>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
    </main>
  );
}
