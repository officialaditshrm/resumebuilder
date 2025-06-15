import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import {connectDB} from './config/db.js'

// App configuration
const app = express()
const port = process.env.PORT || 6501

// Middleware
app.use(express.json())
app.use(cors())

// DB Connection
connectDB()

// API Endpoints
app.use('/', (req, res) => {
    res.json({success: true, message: "API Working"})
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})