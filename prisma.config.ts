import path from "node:path";
import { defineConfig } from "prisma/config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);
