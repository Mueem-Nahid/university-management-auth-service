import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

// application routes

app.use(cors());

// parse data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/book', () => {
   console.log("hello");
})

export default app