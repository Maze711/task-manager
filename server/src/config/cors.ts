import { CorsOptions } from "cors"

export const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}
