import Button from '@components/Layout/Button'
import { GetServerSidePropsContext, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'

/**
 * Handles connection to the Ethereum wallet providers through rainbow-kit.
 * Also, redirect user after logged on.
 * Note: the server side props will ALSO redirect user to dashboard if already logged in.
 */
const Connect: NextPage = () => {
  return (
    <>
      <div className='flex min-h-screen bg-success flex-col items-center justify-center py-2'>
        <Head>
          <title>Web - Turborepo Example</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className='mx-auto w-auto px-4 pt-16 pb-8 sm:pt-24 lg:px-8'>
          <h1 className='mx-auto max-w-5xl text-center text-6xl font-extrabold leading-[1.1] tracking-tighter text-white sm:text-7xl lg:text-8xl xl:text-8xl'>
            Web <br className='hidden lg:block' />
            <span className='inline-block bg-gradient-to-r from-brandred to-brandblue bg-clip-text text-transparent'>
              Turborepo Example
            </span>{' '}
          </h1>
          <div className='mx-auto mt-5 max-w-xl sm:flex sm:justify-center md:mt-8'>
            <Button />
          </div>
        </main>
      </div>
    </>
  )
}

/**
 * If user is authenticated, redirect the user to his dashboard.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  if (session?.user?.id) {
    return {
      redirect: {
        destination: '/dashboard',
        permanant: false,
      },
    }
  }
  return { props: {} }
}

export default Connect
