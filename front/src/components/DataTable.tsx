"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Edit, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";
import { useGlobalChatsContext } from "@/context/globalChatContext";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div>{row.original.originalTitleText.text}</div>,
  },
  {
    accessorKey: "genres",
    header: "Genre",
    cell: ({ row }) => {
      return (
        <div>{row.original.genres?.map((value: any) => value + ", ")}</div>
      );
    },
  },
  {
    accessorKey: "releaseYear.year",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0"
      >
        Year
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.releaseYear.year}</div>,
    sortingFn: "basic",
  },
  {
    accessorKey: "Is series",
    header: "Is series",
    cell: ({ row }) => (
      <div>{row.original.titleType.isSeries ? `Yes` : "No"}</div>
    ),
  },
  {
    accessorKey: "Is episode",
    header: "Is episode",
    cell: ({ row }) => (
      <div>{row.original.titleType.isEpisode ? `Yes` : "No"}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div>Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const Chat = row.original;

      return <DialogDemo movieId={Chat.id} />;
    },
  },
];

export function DataTableDemo({ data }: any) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [title, setTitle] = React.useState("");
  const [genre, setGenre] = React.useState("");
  const [year, setYear] = React.useState("");

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const { setMovies } = useGlobalChatsContext();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data.results,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const fetchMovies = async (title: string, genre: string, year: string) => {
    const queryParams = new URLSearchParams();

    if (title) {
      queryParams.append("title", title);
    }
    if (genre) {
      queryParams.append("genre", genre);
    }
    if (year) {
      queryParams.append("year", year);
    }
    if (!title && !genre && !year) {
      queryParams.append("page", "1");
    }

    const response = await fetch(
      `/api/get-all-chats?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );

    const filteredMovies = await response.json();
    const storageMovies = localStorage.getItem("movies");
    filteredMovies.results = filteredMovies.results.map((mo: any) => {
      if (!storageMovies) return mo;

      const existingMovie = JSON.parse(storageMovies).find(
        (m: any) => m.id === mo.id
      );
      if (existingMovie) {
        return existingMovie;
      }

      return mo;
    });
    setMovies(filteredMovies);
  };

  const titleFilterOnChange = (value: any) => {
    const title = value.target.value;
    setTitle(title);
    fetchMovies(title, genre, year);
  };

  const genreFilterOnChange = (value: any) => {
    const genre = value.target.value;
    setGenre(genre);
    fetchMovies(title, genre, year);
  };

  const yearFilterOnChange = (value: any) => {
    const year = value.target.value;
    setYear(year);
    fetchMovies(title, genre, year);
  };

  return (
    <div className="w-full mx-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <Input
            id="title"
            value={title}
            placeholder="Title"
            onChange={titleFilterOnChange}
          />
          <Input
            id="genre"
            value={genre}
            placeholder="genre"
            onChange={genreFilterOnChange}
          />
          <Input
            id="year"
            value={year}
            type="number"
            placeholder="year"
            onChange={yearFilterOnChange}
          />
        </div>
        <div className="py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border min-h-[700px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </div>
  );
}

export function DialogDemo({ movieId }: any) {
  const { movies, setMovies } = useGlobalChatsContext();
  const movie = movies?.results?.find((item: any) => item.id === movieId);
  const [title, setTitle] = React.useState(movie?.originalTitleText?.text);
  const [year, setYear] = React.useState(movie.releaseYear.year);
  const [open, setOpen] = React.useState(false);
  const [isSeries, setIsSeries] = React.useState(movie.titleType.isSeries);
  const [isEpisode, setIsEpisode] = React.useState(movie.titleType.isEpisode);

  const submit = () => {
    const index = movies?.results?.findIndex((el: any) => el.id == movieId);

    if (index == -1) return setOpen(false);

    const updatedMovies = {
      ...movies,
      results: movies.results.map((movie: any, i: number) => {
        if (i === index) {
          const updatedValue = {
            ...movie,
            originalTitleText: { ...movie.originalTitleText, text: title },
            releaseYear: { ...movie.releaseYear, year },
            titleType: {
              isEpisode,
              isSeries,
            },
          };
          const moviesStore = localStorage.getItem("movies");
          if (moviesStore) {
            const moviesStoreJson = JSON.parse(moviesStore);
            const i = moviesStoreJson.findIndex((v: any) => v.id == movie.id);

            if (i == -1) {
              moviesStoreJson.push(updatedValue);
            } else {
              moviesStoreJson[i] = updatedValue;
            }

            localStorage.setItem("movies", JSON.stringify(moviesStoreJson));
            return updatedValue;
          }

          localStorage.setItem("movies", JSON.stringify([updatedValue]));

          return updatedValue;
        }

        return movie;
      }),
    };

    setMovies(updatedMovies);

    setOpen(false);
  };

  return (
    <Dialog defaultOpen={open} onOpenChange={setOpen} open={open}>
      <DialogTrigger
        asChild
        onClick={() => setOpen(!open)}
        className="cursor-pointer"
      >
        <Edit />
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
            <Label htmlFor="year" className="text-right">
              Is series
            </Label>
            <RadioGroup
              value={isSeries ? "yes" : "no"}
              onValueChange={(value: string) => setIsSeries(value === "yes")}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="r1" />
                <Label htmlFor="r1">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="r2" />
                <Label htmlFor="r2">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right">
              Is episode
            </Label>
            <RadioGroup
              value={isEpisode ? "yes" : "no"}
              onValueChange={(value: string) => setIsEpisode(value === "yes")}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="r1" />
                <Label htmlFor="r1">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="r2" />
                <Label htmlFor="r2">No</Label>
              </div>
            </RadioGroup>
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
