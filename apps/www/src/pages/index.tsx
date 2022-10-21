import { Layout, Link } from '@elevateart/ui'
import type { NextPage } from 'next'

const Home: NextPage = () => (
  <Layout>
    <Layout.Header>
      <Link href='/connect' className='border border-border bg-foreground text-background rounded-primary px-3 py-2 text-xs'>
        Go to App
      </Link>
    </Layout.Header>
    <Layout.Body>
      <Layout.Body.Item>
        <div className='min-h-[calc(100vh-7rem)] space-y-20 h-full flex'>
          <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-[50%] h-auto'>
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
      </Layout.Body.Item>
    </Layout.Body>
  </Layout>
)

export default Home
