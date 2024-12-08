import express from "express"
import cors from "cors"
import pg from "pg"
import dotenv from "dotenv";


dotenv.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT, 10), // Ensure port is a number
});
  db.connect();


const app = express();
const port = 3000;
const corsOptions = {
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the necessary HTTP methods
    allowedHeaders: ['Content-Type'],
}



app.use(express.json());
app.use(cors(corsOptions));

app.get("/get-note", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM Library")
        res.json(result.rows)
    } catch (error) {
        console.log(error)
    }
})

app.delete("/delete-note/:id", async(req, res) => {

    const id = req.params.id;
    await db.query("DELETE FROM Library WHERE id=$1", [id])

})

app.post("/send-note", async(req, res) => {
    
    const title = req.body.title
    const author = req.body.author
    const genre = req.body.genre
    const date = req.body.date
    const ISBN = req.body.ISBN
    try {
        await db.query(
            "INSERT INTO Library (title, author, genre, date, isbn) VALUES ($1, $2, $3, $4, $5)",
            [title, author, genre, date, ISBN]
        )
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
  