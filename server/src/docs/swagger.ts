import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Express } from "express"

export function setupSwagger(app: Express, port: number) {
  const servers = []

  const env = process.env.NODE_ENV ?? "development"

  if (env === "development") {
    servers.push({ url: `http://localhost:${port}/api` })
  } else if (env === "production") {
    servers.push({ url: process.env.API_URL ?? `http://localhost:${port}/api` })
  } else {
    servers.push({ url: `http://localhost:${port}/api` })
  }

  const options: swaggerJSDoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Task Manager API",
        version: "1.0.0",
        description: "REST API for the Task Manager application",
      },
      servers,
      components: {
        schemas: {
          Task: {
            type: "object",
            properties: {
              id: { type: "integer" },
              title: { type: "string" },
              description: { type: "string", nullable: true },
              completed: { type: "boolean" },
              dueDate: { type: "string", format: "date-time", nullable: true },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          Error: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    apis: ["./src/routes/*.ts"],
  }

  const swaggerSpec = swaggerJSDoc(options)

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  )
}
