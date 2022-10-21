// import { Header } from '@components/Layout/Header'
import Layout from '@elevateart/ui/components/layout'
import Link from '@elevateart/ui/components/link'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <Layout.Header />
        <Layout.Body>
          <Layout.Body.Item>
            <div className='min-h-[calc(100vh-7rem)] space-y-20 h-full flex'>
              <div className='w-full flex flex-col justify-center items-center'>
                <div className='w-[40%] h-auto'>
                  <img src='/images/logo-banner.png' alt='elevate art logo' />
                </div>
                <span className='text-xs uppercase'>
                  an&nbsp;
                  <Link href='https://twitter.com/rlxyz_eth'>
                    <span className='font-extrabold line-through'>RLXYZ</span>
                  </Link>
                  &nbsp;production
                </span>
              </div>
            </div>
          </Layout.Body.Item>
        </Layout.Body>
      </Layout>
    </>
  )
}

export default Home
