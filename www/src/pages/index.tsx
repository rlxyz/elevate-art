// import { Header } from '@components/Layout/Header'
import { Layout } from '@components/layout/core/Layout'
import NextLink from '@components/layout/link/NextLink'
import { OrganisationNavigationEnum } from '@utils/enums'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const Hero = () => {
  return (
    <div className='relative flex flex-row justify-center items-center'>
      <div className='w-[50%] h-auto'>
        <div className='relative mt-10'>
          <img className='absolute top-0 left-[-60px] w-64' src='/images/demo.png' alt='demo' />
          <img className='absolute bottom-[-60px] right-[-60px] w-72' src='/images/ffc.png' alt='demo' />
          <img className='absolute bottom-[120px] right-[-100px] w-16' src='/images/squiggle.png' alt='demo' />
          <img src='/images/journey.png' alt='demo' />
          <div className='bg-gradient-to-br from-lightPink via-lightPurple to-lightBlue h-32 w-32 absolute top-[-30px] right-[-20px] -z-10'></div>
        </div>
      </div>
      <div className='w-[50%] h-auto'>
        <h1 className='text-5xl font-bold tracking-wide text-right mb-8'>
          Elevate your
          <br /> NFT Collection
        </h1>
        <p className='text-normal text-right mb-8'>
          Design & launch your NFT Collections for <span className='text-blue'>generative art</span>
        </p>
        <NextLink className='text-white w-fit float-right' href='#'>
          <button className='rounded-[5px] bg-black px-4 py-1 right-0 flex items-center'>
            <img className='w-6' src='./images/logo-white.png' />
            <span className='text-xs'>Start Creating</span>
          </button>
        </NextLink>
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
  if (status === 'authenticated') router.push(`/${OrganisationNavigationEnum.enum.Dashboard}`)
  return (
    <>
      <Layout>
        <Layout.Header />
        <Layout.Body>
          <div className='space-y-20 h-full flex flex-col min-h-[calc(100vh+4.20rem)]'>
            <div className='relative w-full flex flex-col justify-center items-center mt-10'>
              <Hero />
              {/* <Features /> */}
              {/* <Partners /> */}
              {/* <Footer /> */}
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </>
  )
}

export default Home
