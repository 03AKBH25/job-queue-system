import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import jobRoutes from "./src/routes/jobRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.json({ message: "SystemCore API is Live! 🚀", endpoints: "/jobs" });
});

app.use("/jobs",jobRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})