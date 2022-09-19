import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SiweMessage } from 'siwe'
import { prisma } from '../../../server/db/client'

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user, token }) {
      if (session.user && token.sub) {
        session.user = {
          id: token.sub,
          address: token.name,
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
            process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
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

          const user = await prisma.user.findUnique({
            where: {
              address: siwe.address,
            },
            select: {
              id: true,
              address: true,
            },
          })

          // create if user doesnt exists
          if (!user) {
            const newUser = await prisma.$transaction(async (tx) => {
              const { address } = siwe
              const user = await tx.user.create({
                data: { address },
                select: { id: true, address: true },
              })
              const organisation = await tx.organisation.create({
                data: { name: `elevate-${address.substring(2, 8)}-${address.substring(8, 14)}` },
              })
              await tx.organisationAdmin.create({
                data: { organisationId: organisation.id, userId: user.id },
              })
              return { ...user }
            })
            return {
              id: newUser.id,
              name: newUser.address,
            }
          }

          // return user
          return {
            id: user.id,
            name: user.address,
          }
        } catch (e) {
          return null
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)
