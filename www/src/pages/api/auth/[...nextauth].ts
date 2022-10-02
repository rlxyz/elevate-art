import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SiweMessage } from 'siwe'
import { OrganisationDatabaseEnum } from 'src/types/enums'
import { prisma } from '../../../server/db/client'

const whitelist = [
  '0xf8cA77ED09429aDe0d5C01ADB1D284C45324F608',
  '0xb21B6a39ae2f164357f8e616E30521baECfd7f87',
  '0x32B281867C16617F0540a10BB67c42B8fb8bf0dd',
]

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
          if (!nextAuthUrl) return null
          if (siwe.domain !== new URL(nextAuthUrl).host) return null
          console.log(siwe.address)
          if (!siwe.address.length) return null

          await siwe.validate(credentials?.signature || '')
          const { address } = siwe
          if (!whitelist.includes(address)) return null
          // https://github.com/prisma/prisma-client-js/issues/85#issuecomment-660057346
          const user = await prisma.user.upsert({
            where: { address },
            update: {},
            create: {
              address,
              admins: {
                create: {
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
        } catch (e) {
          return null
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)
