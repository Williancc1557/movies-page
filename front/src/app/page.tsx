"use client";

import { DataTableDemo } from "@/components/DataTable";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Edit, SearchXIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CircularProgress, Skeleton } from "@mui/material";
import { useGlobalChatsContext } from "@/context/globalChatContext";

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

      setMovies(await response.json());
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

  console.log(movies);

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="m-10">
        <p className="mb-2">Filters:</p>
        <div className="flex w-60 gap-4 flex-col">
          <Input type="text" placeholder="Year" />
          <Input type="text" placeholder="Year" />
        </div>
        {loading ? (
          <div className="w-full flex justify-center h-96">
            <CircularProgress className="m-auto h-96 w-full" size={80} />
          </div>
        ) : (
          <>
            <DataTableDemo data={movies} />
            <Pagination className="mt-5 mb-5">
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

export function DialogDemo({ movieId }: any) {
  const { movies, setMovies } = useGlobalChatsContext();
  const movie = movies?.results?.find((item: any) => item.id === movieId);
  const [title, setTitle] = useState(movie?.originalTitleText?.text);
  const [year, setYear] = useState(movie.releaseYear.year);
  const [endYear, setEndYear] = useState(movie.releaseYear.endYear);
  const [open, setOpen] = useState(false);

  const submit = () => {
    const index = movies?.results?.findIndex((el: any) => el.id == movieId);

    if (index > -1) {
      const updatedMovies = {
        ...movies,
        results: movies.results.map((movie: any, i: number) =>
          i === index
            ? {
                ...movie,
                originalTitleText: { ...movie.originalTitleText, text: title },
                releaseYear: { ...movie.releaseYear, year, endYear },
              }
            : movie
        ),
      };

      setMovies(updatedMovies);
    }

    setOpen(false);
  };

  return (
    <Dialog defaultOpen={open} onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild onClick={() => setOpen(!open)}>
        <p>Edit data</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit movie</DialogTitle>
          <DialogDescription>
            Make changes to your movie here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              className="col-span-3"
              onChange={(value) => setTitle(value.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right">
              Year
            </Label>
            <Input
              id="year"
              className="col-span-3"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endyear" className="text-right">
              End year
            </Label>
            <Input
              id="endyear"
              className="col-span-3"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={submit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
