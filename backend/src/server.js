import axios from "axios";
import express from "express";

const app = express();

let movies = [];

axios
  .get(`https://imdb-top-100-movies.p.rapidapi.com/`, {
    headers: {
      "x-rapidapi-key": "a2b6215e71mshf33761b57561216p13bc15jsne5ae8d0e66a3",
      "x-rapidapi-host": "imdb-top-100-movies.p.rapidapi.com",
    },
  })
  .then((res) => {
    movies = res.data.map((data) => ({
      id: data.imdbid,
      originalTitleText: {
        text: data.title,
      },
      releaseYear: {
        year: data.year,
      },
      titleType: {
        isSeries: false,
        isEpisode: false,
      },
      genres: data.genre,
    }));
  });

const pageSize = 10;

app.get("/movies/filter", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const titleQuery = req.query.title ? req.query.title.toLowerCase() : "";
  const genreQuery = req.query.genre ? req.query.genre.toLowerCase() : "";

  const filteredMovies = movies.filter((movie) => {
    const matchesTitle = movie.originalTitleText.text
      .toLowerCase()
      .includes(titleQuery);
    const matchesGenre = genreQuery
      ? movie.genres.some((genre) => genre.toLowerCase().includes(genreQuery))
      : true;

    return matchesTitle && matchesGenre;
  });

  const totalResults = filteredMovies.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

  res.json({
    page: page,
    totalResults: totalResults,
    totalPages: totalPages,
    results: paginatedMovies,
  });
});

app.get("/movies/title/search/:title", async (req, res) => {
  const titleQuery = req.params.title.toLowerCase();
  const page = parseInt(req.query.page) || 1;

  const filteredMovies = movies.filter((movie) =>
    movie.originalTitleText.text.toLowerCase().includes(titleQuery)
  );

  const totalResults = filteredMovies.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

  res.json({
    query: titleQuery,
    page: page,
    totalResults: totalResults,
    totalPages: totalPages,
    results: paginatedMovies,
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080...");
});
