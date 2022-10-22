import { EthereumConnectButton } from '@elevateart/eth-auth/components/ConnectButton'
import { Card, Layout, Link } from '@elevateart/ui'
import { useAuthenticated } from '@hooks/utils/useAuthenticated'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'

/**
 * Handles connection to the Ethereum wallet providers through rainbow-kit.
 * Also, redirect user after logged on.
 * Note: the server side props will ALSO redirect user to dashboard if already logged in.
 */
const Connect = () => {
  const { isLoggedIn } = useAuthenticated()
  const router = useRouter()
  if (isLoggedIn) {
    router.push('/dashboard')
  }
  return (
    <Layout>
      <Layout.Header />
      <Layout.Body>
        <Layout.Body.Item border='none'>
          <div className='w-full min-h-[calc(100vh-7rem)] flex lg:grid lg:grid-cols-2 gap-x-12'>
            <div className='hidden lg:block relative'>
              <Image
                className='absolute inset-0 h-full object-cover'
                layout='fill'
                src='/images/protoglyph.png'
                alt='protoglyph-by-larvalabs'
              />
            </div>
            <div className='w-full flex flex-col justify-center space-y-3'>
              <div className='space-y-1'>
                <h1 className='text-xl font-semibold'>Connect your Wallet</h1>
                <p className='text-xs text-accents_6'>
                  Rainbow wallet helps you connect. If your wallet is not supported here, please make a feature request at{' '}
                  <Link color icon href='https://feature.elevate.art'>
                    feature.elevate.art
                  </Link>
                </p>
              </div>
              <EthereumConnectButton>
                <Card>
                  <div className='flex flex-row items-center space-x-2 cursor-pointer'>
                    <img src='images/rainbow.png' className='w-10 h-10 rounded-primary' />
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
