import Link from '@components/Layout/Link'
import { EthereumConnectButton } from '@elevateart/eth-auth/components/ConnectButton'
import { Card, Layout } from '@elevateart/ui'
import { useAuthenticated } from '@hooks/utils/useAuthenticated'
import { GetServerSidePropsContext, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/future/image'
import { useRouter } from 'next/router'

/**
 * Handles connection to the Ethereum wallet providers through rainbow-kit.
 * Also, redirect user after logged on.
 * Note: the server side props will ALSO redirect user to dashboard if already logged in.
 */
const Connect: NextPage = () => {
  const { isLoggedIn } = useAuthenticated()
  const router = useRouter()
  if (isLoggedIn) {
    router.push('/dashboard')
  }
  return (
    <Layout hasFooter={false}>
      <Layout.Body>
        <Layout.Body.Item border='none' hasMargin={false}>
          <div className='w-full min-h-screen flex px-12 lg:px-0 lg:grid lg:grid-cols-10 lg:gap-x-20'>
            <div className='col-span-3 hidden lg:block relative'>
              <Image
                priority
                className='absolute inset-0 h-full object-cover'
                sizes='30vw'
                fill
                src='/images/refikanadol.jpeg'
                alt='refik-moma'
              />
              <Link href='/'>
                <Image
                  className='absolute bg-foreground rounded-full border border-border left-5 top-5 p-2'
                  width={50}
                  height={50}
                  src='/images/logo-white.png'
                  alt='elevate-art-logo'
                />
              </Link>
            </div>
            <div className='col-span-4 w-full flex flex-col justify-center space-y-6'>
              <div className='space-y-4'>
                <h1 className='text-3xl font-semibold'>Connect your Wallet</h1>
                <p className='text-sm text-accents_6'>
                  Rainbow helps you connect. If your wallet is not supported here, please make a feature request at{' '}
                  <Link
                    color
                    icon
                    underline
                    href='https://feature.elevate.art'
                    rel='noreferrer nofollow'
                    target='_blank'
                    className='w-fit'
                  >
                    feature.elevate.art
                  </Link>
                </p>
              </div>
              <EthereumConnectButton>
                <Card>
                  <div className='flex flex-row items-center space-x-2 cursor-pointer'>
                    <Image src='/images/rainbow.png' alt='rainbow-wallet' width={35} height={35} className='rounded-primary' />
                    <span className='font-semibold'>Rainbow</span>
                  </div>
                </Card>
              </EthereumConnectButton>
            </div>
          </div>
        </Layout.Body.Item>
      </Layout.Body>
    </Layout>
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
