"use client";

import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState({} as any);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const response = await fetch(`/api/get-all-chats?page=${page}`, {
        method: "GET",
      });
      setMovies(await response.json());

      setLoading(false)
    };

    fetchData();
  }, [page]);


  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(Number.parseInt(page as any) - 1);
    }
  };

  const handleNextPage = () => {
      setPage(Number.parseInt(page as any) + 1);
  };

  const handlePageSelect = (pageNumber: number) => {
    setPage(pageNumber);
  };

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
                    <Card className="h-60">
                      <CardHeader>
                        <CardTitle>{movie.originalTitleText.text}</CardTitle>
                        <CardDescription>{movie.releaseYear.year}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Is episode: {movie.titleType.isEpisode ? "yes" : "no"}</p>
                        <p>Is series: {movie.titleType.isSeries ? "yes" : "no"}</p>
                      </CardContent>
                      <CardFooter>
                        <p>{movie.releaseYear.endYear ? "The end year is " + movie.releaseYear.endYear : "No end year"}</p>
                      </CardFooter>
                    </Card>
                  </div>
                ))
              }
            </div>
          </div>
          <Pagination className="mt-5 mb-5">
            {loading ? "Loading" :
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={handlePreviousPage} />
              </PaginationItem>

              {[movies.page, Number.parseInt(movies.page) + 1].map((element, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    isActive={page == element}
                    onClick={() => handlePageSelect(element)}
                  >
                    {element}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext onClick={handleNextPage} />
              </PaginationItem>
            </PaginationContent>
            }
          </Pagination>
        </div>
    </main>
  );
}
