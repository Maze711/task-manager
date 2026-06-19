export const API_URL =
  process.env.NEXT_PUBLIC_NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_API_URL_DEV
      : process.env.NEXT_PUBLIC_API_URL_LOCAL ?? "http://localhost:4000/api"
