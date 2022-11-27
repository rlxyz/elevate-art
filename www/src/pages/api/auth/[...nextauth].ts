import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SiweMessage } from 'siwe'
import { env } from 'src/env/server.mjs'
import { OrganisationDatabaseEnum, OrganisationDatabaseRoleEnum } from 'src/shared/enums'
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
  secret: env.NEXTAUTH_SECRET,
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
          /** Check SiweMessage for Ethereum Login */
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'))
          const nextAuthUrl = process.env.VERCEL ? `https://${env.NEXTAUTH_URL}` : env.NEXTAUTH_URL
          if (!nextAuthUrl) return null
          if (siwe.domain !== new URL(nextAuthUrl).host) return null
          if (!siwe.address.length) return null
          await siwe.validate(credentials?.signature || '')
          const { address } = siwe

          /** Create user if does not exists */
          const user = await prisma.user.upsert({
            where: { address },
            update: {},
            create: {
              address,
              members: {
                create: {
                  type: OrganisationDatabaseRoleEnum.enum.Admin,
                  organisation: {
                    create: {
                      type: OrganisationDatabaseEnum.enum.Personal,
                      name: `elevate-${address.substring(2, 8)}-${(Math.random() + 1).toString(36).substring(6)}`,
                    },
                  },
                },
              },
            },
            select: { id: true, address: true },
          })

          return {
            id: user.id,
            name: user.address,
          }
        } catch (err) {
          console.error(err)
          return null
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)
