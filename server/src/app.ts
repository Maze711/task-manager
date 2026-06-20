import { config } from "dotenv"
config()
import express from "express"
import cors from "cors"
import routes from "./routes"
import { corsOptions } from "./config/cors"
import { setupSwagger } from "./docs/swagger"
import { getErrorMessage } from "./utils/get-error-message"

const app = express()
const PORT = Number(process.env.PORT) || 4000

app.use(cors(corsOptions))
app.use(express.json())

app.use("/api", routes)

setupSwagger(app, PORT)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[ErrorHandler]", {
    message: err.message,
    stack: err.stack?.split("\n").slice(0, 3).join("\n"),
  })
  res.status(500).json({
    error: getErrorMessage(err, "Internal server error"),
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`API docs: http://localhost:${PORT}/api/docs`)
})
