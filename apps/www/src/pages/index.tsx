import { Layout, Link } from '@elevateart/ui'
import type { NextPage } from 'next'
import Image from 'next/image'

const Home: NextPage = () => (
  <Layout>
    <Layout.Header>
      <Link href='/connect' className='border border-border bg-foreground text-background rounded-primary px-3 py-2 text-xs'>
        Go to App
      </Link>
    </Layout.Header>
    <Layout.Body>
      <Layout.Body.Item border='none'>
        <div className='min-h-[calc(100vh-6.6rem)] space-y-20 h-full flex'>
          <div className='w-full flex flex-col justify-center items-center'>
            <div className='relative w-1/2 h-1/2'>
              <Image priority className='object-contain' layout='fill' src='/images/logo-banner.png' alt='elevate-art-logo' />
            </div>
          </div>
        </div>
      </Layout.Body.Item>
    </Layout.Body>
  </Layout>
)

export default Home
