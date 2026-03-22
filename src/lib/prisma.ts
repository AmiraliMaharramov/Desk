import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function buildClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url || url === "undefined") {
    throw new Error("[prisma] DATABASE_URL is not configured.");
  }
  const libsql = createClient({ url });
  const adapter = new PrismaLibSql(libsql);
  return new PrismaClient({
    adapter,
  } as ConstructorParameters<typeof PrismaClient>[0]);
}

// Lazily build & memoize so the env var is read at request time, not import time.
export function getPrisma(): PrismaClient {
  if (!global.__prisma) {
    global.__prisma = buildClient();
  }
  return global.__prisma;
}

// Convenience proxy so callers can still write `prisma.user.findMany()`
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_t, prop) {
    const client = getPrisma();
    const val = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof val === "function") return val.bind(client);
    return val;
  },
});
