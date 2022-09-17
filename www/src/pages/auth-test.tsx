import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const token = await getToken({ req: context.req })

  const address = token?.sub ?? null

  if (!address) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      address,
      session,
    },
  }
}

type AuthenticatedPageProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function AuthenticatedPage({ address }: AuthenticatedPageProps) {
  return address ? <h1>Authenticated as {address}</h1> : <h1>Unauthenticated</h1>
}
