import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServerRoutes } from './routes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

try {
	createServerRoutes(app)
} catch (err) {
	console.error('Failed to initialize server routes:', err)
	// rethrow so the process exits with a visible error
	throw err
}

const port = process.env.PORT || 54321
app.listen(port, () => console.log(`Server listening on ${port}`))
