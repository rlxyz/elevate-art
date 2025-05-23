import { log } from '@utils/logger'
import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SiweMessage } from 'siwe'
import { env } from 'src/env/server.mjs'
import { prisma } from 'src/server/db/client'
import { OrganisationDatabaseEnum, OrganisationDatabaseRoleEnum } from 'src/shared/enums'

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
  // cookies: {
  //   sessionToken: {
  //     name: 'next-auth.session-token',
  //     options: {
  //       domain: 'localhost',
  //       path: '/',
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       secure: false,
  //     },
  //   },
  // },
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
          const nextAuthUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : env.NEXTAUTH_URL
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
          log.debug(`new authorize login`, { user: user.id })
          return {
            id: user.id,
            name: user.address,
          }
        } catch (err) {
          log.error(`authorize error`, { err })
          console.error(`authorize error`, err)
          return null
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)
