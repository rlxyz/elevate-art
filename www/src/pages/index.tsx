// import { Header } from '@components/Layout/Header'
import { Layout } from '@components/Layout/core/Layout'
import { Link } from '@components/Layout/Link'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'
import { useAuthenticated } from '../hooks/utils/useAuthenticated'

const Guide = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <span className='uppercase text-xs'>Elevate with us</span>
      <span className='lowercase text-xl'>Create</span>
      <span className='font-bold text-4xl'>Start with creating your collection</span>
      <div className='mt-8 w-[60%] grid grid-cols-2 space-x-4'>
        <div className='col-span-1 text-sm'>
          Developers love Next.js, the open source React framework Vercel built together with Google and Facebook. Next.js powers
          the biggest websites like Patreon, for use cases in e-commerce, travel, news, and marketing.
        </div>
        <div className='col-span-1 text-sm'>
          Vercel is the best place to deploy any frontend app. Start by deploying with zero configuration to our global edge
          network. Scale dynamically to millions of pages without breaking a sweat.
        </div>
      </div>
      <div className='mt-8 grid grid-cols-2 space-x-16'>
        <div className='left-0 col-span-1 text-sm border border-mediumGrey rounded-[5px]'>
          <img
            className='rounded-[5px]'
            src='https://uploads-ssl.webflow.com/62fb25dec6d6000039acf36b/63031ad32ea56e5ca7347090_Images-p-1600.png'
          />
        </div>
        <div className='col-span-1 text-sm mt-20 space-y-16 w-[50%]'>
          <div className='flex flex-col'>
            <h1 className='text-xl font-semibold'>Fast Refresh</h1>
            <span>Reliable live-editing experience for your UI components.</span>
          </div>
          <div className='flex flex-col'>
            <h1 className='text-xl font-semibold'>Fast Refresh</h1>
            <span>Reliable live-editing experience for your UI components.</span>
          </div>
          <div className='flex flex-col'>
            <h1 className='text-xl font-semibold'>Fast Refresh</h1>
            <span>Reliable live-editing experience for your UI components.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const CoolShit = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center space-y-6 my-2'>
      <div className='h-72 flex items-center'>
        <img src='/images/logo-thankyoux.png' />
      </div>
      <div className='flex'>
        <div className='text-5xl'>unlock the power of&#8201;</div>
        <h1 className='text-5xl font-extrabold text-transparent bg-gradient-to-r bg-clip-text from-[#243c5a] to-[#243c5a]'>
          generate art
        </h1>
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  const router = useRouter()
  const { isLoggedIn } = useAuthenticated()

  useEffect(() => {
    isLoggedIn && router.push(`/${OrganisationNavigationEnum.enum.Dashboard}`)
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <>
        <Layout>
          <Layout.Header />
          <Layout.Body>
            <div className=' space-y-20 h-full flex'>
              <div className='w-full flex flex-row justify-center items-center mt-10'>
                <div className='w-[50%] h-auto'>
                  <div className='relative'>
                    <img className='absolute top-0 left-[-60px] w-64' src='/images/demo.png' alt='demo' />
                    <img className='absolute bottom-[-60px] right-[-40px] w-72' src='/images/ffc.png' alt='demo' />
                    <img src='/images/journey.png' alt='demo' />
                    <div className='bg-darkGrey h-32 w-32 absolute right-[-50]'></div>
                  </div>
                </div>
                <div className='w-[50%] h-auto'>
                  <h1 className='text-4xl font-bold tracking-wide text-right'>
                    Elevate your
                    <br /> NFT Collection
                  </h1>
                  <p className='text-sm text-right'>
                    Design & launch your NFT Collections for <span className='text-blue'>generative art</span>
                  </p>
                  <Link className='text-white' external={true} href='#'>
                    <button className='rounded-full bg-darkGrey px-4 py-1 right-0 flex items-center float-right'>
                      <img className='w-8' src='./images/logo-white.png' />
                      Start Creating
                    </button>
                  </Link>
                </div>
              </div>
              {/* <Guide /> */}
              {/* <CoolShit /> */}
            </div>
          </Layout.Body>
        </Layout>
      </>
    )
  }

  return null
}

export default Home
