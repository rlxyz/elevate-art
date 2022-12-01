import NextLink from '@components/layout/link/NextLink'
import { Layout, Link } from '@elevateart/ui'
import type { NextPage } from 'next'

const Home: NextPage = () => (
  <Layout>
    <Layout.Header>
      <NextLink href='/connect' className='border border-border bg-foreground text-background rounded-primary p-2 text-xs'>
        Go to App
      </NextLink>
    </Layout.Header>
    <Layout.Body>
      <Layout.Body.Item border='none'>
        <div className='min-h-[calc(100vh-7rem)] h-full flex flex-col items-center justify-center'>
          <div className='text-xs uppercase'>
            <span>
              an&nbsp;
              <Link underline href='https://twitter.com/rlxyz_eth'>
                <span className='font-extrabold line-through'>RLXYZ</span>
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
