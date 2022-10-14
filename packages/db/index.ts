import { PrismaClient } from "@prisma/client";

/**
 * Exports a prisma client that can be used to talk with the Planetscale Database.
 * Note: Do not use on client-side. It will error.
 **/
export const prisma = new PrismaClient({
  log: ["query"],
});
