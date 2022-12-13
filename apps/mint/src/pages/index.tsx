// import { Header } from '@components/Layout/Header'
import { Layout } from '@Components/ui/core/Layout'
import NextLink from '@Components/ui/link/NextLink'
import type { NextPage } from 'next'
import Image from 'next/image'

const Hero = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className='xs:ml-10 sm:ml-0 grid md:grid-cols-2 place-content-center justify-items-center'>
        <div className='relative w-[100%] md:w-full lg:w-[90%] xl:w-[80%] 2xl:w-[80%]'>
          <Image width={364} height={213} className='w-[60%] absolute top-0 left-[-60px]' src='/images/demo.png' alt='demo-image' />
          <Image
            width={423}
            height={300}
            className='w-2/4 absolute xs:bottom-[-20px] sm:bottom-[-60px] xs:right-[-40px] sm:right-[-60px]'
            src='/images/ffc.png'
            alt='ffc-image'
          />
          <Image
            width={85}
            height={126}
            className='md:w-[15%] w-[1/3] xs:hidden absolute md:bottom-[80px] lg:bottom-[80px] xl:bottom-[120px] lg:right-[-100px] md:right-[-80px]'
            src='/images/squiggle.png'
            alt='squiggle-image'
          />
          <Image width={629} height={786} className='' src='/images/journey.png' alt='journey-by-jacob' />
          <div className='bg-gradient-to-br from-lightPink via-lightPurple to-lightBlue h-32 w-32 absolute top-[-30px] right-[-20px] -z-10' />
        </div>
        <div className='xs:mt-5 sm:mt-0 flex flex-col justify-center xs:items-start sm:items-end'>
          <h1 className='xs:text-3xl sm:text-5xl font-bold tracking-wide sm:text-right xs:mb-4 sm:mb-8'>
            elevate your
            <br /> nft collection
          </h1>
          <p className='text-normal sm:text-right xs:mb-4 sm:mb-8'>
            design & launch <span className='text-blueHighlight'>generative</span> nft collections
          </p>
          <NextLink className='text-white w-fit' href={`/connect`}>
            <button className='rounded-[5px] bg-black px-4 py-1 flex items-center'>
              <img className='w-6' src='./images/logo-white.png' />
              <span className='text-xs'>Start Creating</span>
            </button>
          </NextLink>
        </div>
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <Layout.Header authenticated={false} />
        <Layout.Body>
          <div className='min-h-[calc(100vh-7.14rem)] flex items-center'>
            <div className='space-y-20 h-full flex flex-col xs:my-10 sm:my-20'>
              <div className='w-full flex flex-col justify-center items-center space-y-10'>
                <Hero />
              </div>
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </>
  )
}

export default Home
