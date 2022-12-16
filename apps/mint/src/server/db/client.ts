import { PrismaClient } from '@prisma/client'

// import { env } from '../../env/server.mjs'

//! the env variable is not typesafe anymore... why? because we used prisma in getServerSideProps in client
//! and this was the fix; https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    // log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
