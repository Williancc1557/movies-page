"use client";

import { DataTableDemo } from "@/components/DataTable";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { CircularProgress, Skeleton } from "@mui/material";
import { useGlobalChatsContext } from "@/context/globalChatContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Home() {
  const { movies, setMovies } = useGlobalChatsContext();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(`/api/get-all-chats?page=${page}`, {
        method: "GET",
      });

      const movies = await response.json();
      const storageMovies = localStorage.getItem("movies");
      movies.results = movies.results.map((mo: any) => {
        if (!storageMovies) return mo;

        const existingMovie = JSON.parse(storageMovies).find(
          (m: any) => m.id === mo.id
        );
        if (existingMovie) {
          return existingMovie;
        }

        return mo;
      });

      setMovies(movies);
      setLoading(false);
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

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="m-10">
        {loading ? (
          <div className="w-full flex justify-center h-[85vh]">
            <CircularProgress className="m-auto h-96 w-full" size={80} />
          </div>
        ) : (
          <>
            <DataTableDemo data={movies} />
            <Pagination className="mt-5 mb-5 relative top-[-60px]">
              {loading ? (
                "Loading"
              ) : (
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={handlePreviousPage} />
                  </PaginationItem>

                  {(movies.page == 1
                    ? [
                        movies.page,
                        Number.parseInt(movies.page) + 1,
                        Number.parseInt(movies.page) + 2,
                      ]
                    : [
                        Number.parseInt(movies.page) - 1,
                        movies.page,
                        Number.parseInt(movies.page) + 1,
                      ]
                  ).map((element, index) => (
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
              )}
            </Pagination>
          </>
        )}
      </div>
    </main>
  );
}
