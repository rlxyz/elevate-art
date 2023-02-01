import { PrismaClient } from '@prisma/client'
import { env } from 'src/env/client.mjs'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    // log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    log: env.NEXT_PUBLIC_NODE_ENV === 'localhost' ? ['error', 'warn'] : ['error'],
  })

if (env.NEXT_PUBLIC_NODE_ENV !== 'production') {
  global.prisma = prisma
}
