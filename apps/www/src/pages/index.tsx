import Link from '@components/Layout/Link'
import { Layout } from '@elevateart/ui'
import type { NextPage } from 'next'
import Image from 'next/future/image'

const Home: NextPage = () => (
  <Layout>
    <Layout.Header>
      <Link href='/connect' className='border border-border bg-foreground text-background rounded-primary p-2 text-xs'>
        Go to App
      </Link>
    </Layout.Header>
    <Layout.Body>
      <Layout.Body.Item border='none'>
        <div className='min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center'>
          <Image
            priority
            width={1200}
            height={285}
            sizes='50vw'
            src='/images/logo-banner.png'
            alt='elevate-art-logo-banner'
            className='w-1/2 h-auto'
          />
          <span className='text-xs uppercase'>
            an&nbsp;
            <Link underline href='https://twitter.com/rlxyz_eth' className='w-fit'>
              <span className='font-extrabold line-through'>RLXYZ</span>
            </Link>
            &nbsp;production
          </span>
        </div>
      </Layout.Body.Item>
    </Layout.Body>
  </Layout>
)

export default Home
