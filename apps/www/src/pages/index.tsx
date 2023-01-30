// import { Header } from '@components/Layout/Header'
import Card from '@components/layout/card/Card'
import { Layout } from '@components/layout/core/Layout'
import NextLink from '@components/layout/link/NextLink'
import { OrganisationNavigationEnum } from '@utils/enums'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { routeBuilder } from 'src/client/utils/format'

const Hero = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className='xs:ml-10 sm:ml-0 grid md:grid-cols-2 place-content-center justify-items-center'>
        <div className='hidden md:block relative w-[100%] sm:w-[50%] md:w-[70%] lg:w-[90%] xl:w-[80%] 2xl:w-[80%]'>
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
          <Image width={629} height={786} priority src='/images/journey.png' alt='journey-by-jacob' />
          <div className='bg-gradient-to-br from-lightPink via-lightPurple to-lightBlue h-32 w-32 absolute top-[-30px] right-[-20px] -z-10' />
        </div>
        <div className='block md:hidden'>
          <Image priority width={3042} height={723} src='/images/logo-banner.png' alt='logo-banner' />
        </div>
        <div className='hidden md:flex flex-col justify-center xs:items-start sm:items-end'>
          <h1 className='xs:text-3xl sm:text-5xl font-bold tracking-wide sm:text-right xs:mb-4 sm:mb-8'>
            elevate your
            <br /> nft collection
          </h1>
          <p className='text-normal sm:text-right xs:mb-4 sm:mb-8'>
            design & launch <span className='text-blueHighlight'>generative</span> nft collections
          </p>
          <NextLink className='text-white w-fit' href={`/connect`}>
            <button className='rounded-[5px] bg-black px-4 py-1 flex items-center'>
              <Image width={32} height={32} src='/images/logo-white.png' alt='logo-white' />
              <span className='text-xs'>Start Creating</span>
            </button>
          </NextLink>
        </div>
      </div>
    </div>
  )
}

const Mint = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className='xs:ml-10 sm:ml-0 grid md:grid-cols-2 place-content-center justify-items-center'>
        <div className='hidden md:block relative w-[100%] sm:w-[50%] md:w-[70%] lg:w-[90%] xl:w-[80%] 2xl:w-[80%]'>
          <Image width={629} height={786} priority src='/images/journey.png' alt='journey-by-jacob' />
        </div>
        <div className='block md:hidden'>
          <Image priority width={3042} height={723} src='/images/logo-banner.png' alt='logo-banner' />
        </div>

        <div className='hidden md:flex flex-col justify-center xs:items-start sm:items-start  w-2/3'>
          <h1 className='xs:text-3xl sm:text-5xl font-bold tracking-wide sm:text-left xs:mb-4 sm:mb-8'>Journey</h1>
          <div className='flex'>
            <div className='flex flex-col justify-around w-full mr-4'>
              <p className='font-medium text-darkGrey xs:mb-4 sm:mb-0'>Created by</p>
              <Card className='drop-shadow-2xl space-x-2 py-0 bg-white rounded-[99px]  hover:-translate-y-1'>
                <a href='#' className='group block flex-shrink-0'>
                  <div className='flex items-center'>
                    <div className=' '>
                      <img className='inline-block h-9 w-9 rounded-full' src='images/avatar-blank.png' alt='' />
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm font-medium text-semiBold group-hover:text-gray-900'>@jacob</p>
                    </div>
                  </div>
                </a>
              </Card>
            </div>
            <div className='flex flex-col justify-around  w-full'>
              <p className='font-medium text-darkGrey xs:mb-4 sm:mb-0 '>Collection</p>
              <Card className='drop-shadow-2xl py-0 bg-white  hover:-translate-y-1 my-1'>
                <a href='#' className='group block flex-shrink-0'>
                  <div className='flex items-center'>
                    <div>
                      <img className='inline-block h-9 w-9 rounded-full' src='images/avatar-blank.png' alt='' />
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm font-medium text-semiBold group-hover:text-gray-900'>@jacob</p>
                    </div>
                  </div>
                </a>
              </Card>
            </div>
          </div>
          <NextLink className='text-white py-4' href={`/connect`}>
            <button className='rounded-full w-full bg-black px-8 py-2 flex item-center justify-center'>
              <Image width={40} height={40} src='/images/logo-white.png' alt='logo-white' />
              <span className='text-lg'>Mint</span>
            </button>
          </NextLink>
        </div>
      </div>
    </div>
  )
}

const Features = () => {
  return (
    <div className='w-full mt-32 relative '>
      <div className='w-full  flex justify-center items-center'>
        <div className='w-[70%] bg-white flex flex-row'>
          <div className='p-2  border-lightGray border-2'>
            <img className='mt-4 min-h-[250px]' src='/images/feature-generate.png' alt='Generate Feature' />
            <h3 className='font-bold text-sm text-center my-4'>Generate in Seconds</h3>
            <p className='text-center text-xs mb-4'>
              Drag & drop to upload traits &<br /> generate in seconds
            </p>
          </div>
          <div className='px-2  border-lightGray border-2'>
            <img className='mt-4 min-h-[250px]' src='/images/feature-refine.png' alt='Generate Feature' />
            <h3 className='font-bold text-sm text-center my-4'>Refine with Ease</h3>
            <p className='text-center text-xs mb-4'>
              Apply Custom Rules & Rarity for your <br />
              specific traits
            </p>
          </div>
          <div className='px-2  border-lightGray border-2'>
            <img className='mt-4 min-h-[250px] items-center' src='/images/feature-curate.png' alt='Generate Feature' />
            <h3 className='font-bold text-sm text-center my-4'>Curation made Easy</h3>
            <p className='text-center text-xs mb-4'>Use filters to view your collection by rarity and tweak before exporting</p>
          </div>
        </div>
      </div>
      <div className='bg-lightGray absolute h-[850px] w-[100%] -z-10 top-[-200px]'></div>
    </div>
  )
}

const Partners = () => {
  return (
    <div className='w-[90%] mt-20'>
      <div className='w-full flex flex-col justify-center items-center space-y-6 my-2'>
        <div className='grid grid-cols-5 gap-1'>
          <img className='' src='/images/pfp-1.png' alt='pfp-1' />
          <img className='' src='/images/pfp-1.png' alt='pfp-1' />
          <img className='' src='/images/pfp-1.png' alt='pfp-1' />
          <img className='' src='/images/pfp-1.png' alt='pfp-1' />
          <img className='' src='/images/pfp-1.png' alt='pfp-1' />
        </div>
      </div>
    </div>
  )
}

const Footer = () => {
  const style = {
    textShadow: '-0.5px -1px 0 #FFF, 0.5px -1px 0 #FFF, -0.5px 1px 0 #FFF, 0.5px 1px 0 #FFF',
  }

  return (
    <div className='w-full mt-24 '>
      <div className='w-full flex flex-col justify-center items-center space-y-6 my-2 bg-black h-[320px]'>
        <div className='w-[70%]'>
          <h2 className='text-4xl text-[#e7e7e7]'>
            Design your NFT collection seamlessly.
            <div className='flex flex-row justify-between items-center'>
              <h2 className='text-[#e7e7e7]'>
                {"Let's "}
                <span style={style} className=' text-black'>
                  elevate art
                </span>{' '}
                together
              </h2>
              <div className='relative flex flex-row'>
                <img className='w-16 h-16' src='/images/circle1.png' alt='circle1' />
                <img className='w-16 h-16' src='/images/circle2.png' alt='circle2' />
                <img className='w-16 h-16' src='/images/circle3.png' alt='circle3' />
                <hr className='color-white'></hr>
              </div>
            </div>
          </h2>
        </div>
        <div className='w-[70%]'>
          <div className='flex flex-row justify-start'>
            <NextLink className='text-white right-0' href='#'>
              <button className='rounded-full bg-white px-4 py-1 right-0 flex items-center float-right '>
                <img className='w-8' src='./images/logo-black.png' />
                <span className=' text-black'>Start Creating</span>
              </button>
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  const { status } = useSession()
  const router = useRouter()
  if (status === 'authenticated') router.push(routeBuilder(OrganisationNavigationEnum.enum.Dashboard))
  return (
    <>
      <Layout>
        <Layout.AppHeader border='lower' authenticated={false} />
        <Layout.Body>
          <div className='min-h-[calc(100vh-7.14rem)] flex items-center'>
            <div className='space-y-20 h-full flex flex-col xs:my-10 sm:my-20'>
              <div className='w-full flex flex-col justify-center items-center space-y-10'>
                {/* <Hero /> */}
                <Mint />
                {/* <Features /> */}
                {/* <Partners /> */}
                {/* <Footer /> */}
              </div>
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </>
  )
}

export default Home
