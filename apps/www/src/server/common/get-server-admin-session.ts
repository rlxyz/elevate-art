import { type GetServerSidePropsContext } from 'next'
import { getServerAuthSession } from './get-server-auth-session'

/**
 * Add new admin addresses here.
 */
const admins = new Map<string, boolean>([
  ['0xf8cA77ED09429aDe0d5C01ADB1D284C45324F608', true],
  ['0xd2a08007eeeaf1f81eeF54Ba6A8c4Effa1e545C6', true],
  ['0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', true],
])

export const getServerAdminSession = async (ctx: { req: GetServerSidePropsContext['req']; res: GetServerSidePropsContext['res'] }) => {
  const session = await getServerAuthSession(ctx)

  if (!session) return null

  const address = session?.user?.address
  if (!address) return null

  const isAdmin = admins.has(address)
  if (!isAdmin) return null

  return session
}
