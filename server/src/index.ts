import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServerRoutes } from './routes'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

createServerRoutes(app)

const port = process.env.PORT || 54321
app.listen(port, () => console.log(`Server listening on ${port}`))
