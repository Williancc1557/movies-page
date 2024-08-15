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
    }));
  });

const pageSize = 10;

app.get("/movies/filter", async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const paginatedMovies = movies.slice(startIndex, endIndex);

  res.json({
    page: page,
    totalResults: movies.length,
    totalPages: Math.ceil(movies.length / pageSize),
    results: paginatedMovies,
  });
});

app.get("/movies/title/search/:title", async (req, res) => {
  const titleQuery = req.params.title.toLowerCase();

  const filteredMovies = movies.filter((movie) =>
    movie.originalTitleText.text.toLowerCase().includes(titleQuery)
  );

  res.json({
    query: titleQuery,
    totalResults: filteredMovies.length,
    results: filteredMovies,
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080...");
});
