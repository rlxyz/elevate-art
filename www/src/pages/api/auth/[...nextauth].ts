import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SiweMessage } from 'siwe'
import { prisma } from '../../../server/db/client'

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user = {
          id: token.sub,
        }
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'))

          const nextAuthUrl =
            process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
          if (!nextAuthUrl) {
            return null
          }

          const nextAuthHost = new URL(nextAuthUrl).host
          if (siwe.domain !== nextAuthHost) {
            return null
          }

          // todo: reintroduce
          // if (siwe.nonce !== (await getCsrfToken({ req }))) {
          //   return null
          // }

          await siwe.validate(credentials?.signature || '')
          return {
            id: siwe.address,
          }
        } catch (e) {
          return null
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)
