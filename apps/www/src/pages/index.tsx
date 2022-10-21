import { Layout, Link } from '@elevateart/ui'
import type { NextPage } from 'next'

const Home: NextPage = () => (
  <Layout>
    <Layout.Header>
      <Link href='/connect' className='border border-border rounded-primary px-2 py-1 text-xs text-accents_6'>
        Connect Wallet
      </Link>
    </Layout.Header>
    <Layout.Body>
      <div className='min-h-[calc(100vh-7rem)] space-y-20 h-full flex'>
        <div className='w-full flex flex-col justify-center items-center'>
          <div className='w-[40%] h-auto'>
            <img src='/images/logo-banner.png' alt='elevate art logo' />
          </div>
          <span className='text-xs uppercase'>
            an&nbsp;
            <Link color href='https://twitter.com/rlxyz_eth'>
              RLXYZ
            </Link>
            &nbsp;production
          </span>
        </div>
      </div>
    </Layout.Body>
  </Layout>
)

export default Home
