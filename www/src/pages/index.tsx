// import { Header } from '@components/layout/Header'
import { Layout } from '@components/y/core/Layout'
import { Link } from '@components/y/Link'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'

const Home: NextPage = () => {
  const { status } = useSession()
  return (
    <Layout>
      <Layout.Header authenticated={status === 'authenticated'} />
      <Layout.Body>
        <div className='min-h-[calc(100vh-7rem)] space-y-20 h-full flex'>
          <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-[50%] h-auto'>
              <img src='/images/logo-banner.png' alt='elevate art logo' />
            </div>
            <span className='text-xs uppercase'>
              an&nbsp;
              <Link external={true} href='https://twitter.com/rlxyz_eth'>
                <span className='font-extrabold line-through'>RLXYZ</span>
              </Link>
              &nbsp;production
            </span>
          </div>
        </div>
      </Layout.Body>
    </Layout>
  )
}

export default Home
