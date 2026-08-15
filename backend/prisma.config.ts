import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: "postgresql://postgres:kinshu0098@localhost:5432/matrimony_db?schema=public"
  }
});