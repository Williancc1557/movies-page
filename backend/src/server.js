import axios from "axios"
import express from "express"

const app = express()

app.get("/movies/filter", async (req, res) => {
    const queryObject = req.query;

    const queryString = Object.keys(queryObject)
        .map(key => `${key}=${queryObject[key]}`)
        .join('&');

    console.log(queryString)

    const apiRes = await axios.get(`https://moviesdatabase.p.rapidapi.com/titles?${queryString}`, {
        headers: {
            "x-rapidapi-key": "a2b6215e71mshf33761b57561216p13bc15jsne5ae8d0e66a3",
            "x-rapidapi-host": "moviesdatabase.p.rapidapi.com"
        }
    })

    res.json(apiRes.data)
})

app.listen(8080, () => {
    console.log("Server is running on port 8080...")
})
