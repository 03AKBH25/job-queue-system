import express from "express";
import dotenv from "dotenv"
import jobRoutes from "./src/routes/jobRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(jobRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})