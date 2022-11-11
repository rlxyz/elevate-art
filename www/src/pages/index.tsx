// import { Header } from '@components/Layout/Header'
import { Layout } from '@components/Layout/core/Layout'
import { Link } from '@components/Layout/Link'
import { useAuthenticated } from '@hooks/utils/useAuthenticated'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'

const Hero = () => {
  return (
    <div className=' flex flex-row justify-center items-center'>
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
        <Link className='text-white' external={true} href='#'>
          <button className='rounded-full bg-black px-4 py-1 right-0 flex items-center float-right'>
            <img className='w-8' src='./images/logo-white.png' />
            Start Creating
          </button>
        </Link>
      </div>
    </div>
  )
}

const Features = () => {
  return (
    <div className='w-full mt-20 relative bg-white'>
      <div className='w-full flex flex-row justify-center items-center'>
        <div className='p-2  border-lightGray border-2'>
          <img className='mt-4' src='/images/feature-generate.png' alt='Generate Feature' />
          <h3 className='font-bold text-sm text-center my-4'>Generate in Seconds</h3>
          <p className='text-center text-xs mb-4'>
            Drag & drop to upload traits &<br /> generate in seconds
          </p>
        </div>
        <div className='px-2  border-lightGray border-2'>
          <img className='mt-4' src='/images/feature-refine.png' alt='Generate Feature' />
          <h3 className='font-bold text-sm text-center my-4'>Refine with Ease</h3>
          <p className='text-center text-xs mb-4'>
            Apply Custom Rules & Rarity for your <br />
            specific traits
          </p>
        </div>
        <div className='px-2  border-lightGray border-2'>
          <img className='mt-4' src='/images/feature-curate.png' alt='Generate Feature' />
          <h3 className='font-bold text-sm text-center my-4'>Curation made Easy</h3>
          <p className='text-center text-xs mb-4'>Use filters to view your collection by rarity and tweak before exporting</p>
        </div>
      </div>
      <div className='bg-lightGray absolute h-[750px] w-[100%] -z-10 top-[-160px]'></div>
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
  return (
    <div className='w-full mt-20'>
      <div className='w-full flex flex-col justify-center items-center space-y-6 my-2 bg-darkGrey'>
        <h2 className='text-4xl'>
          Design your NFT collection seamlessly.
          <br />
          Let's elevate art together
        </h2>
        <Link className='text-white' external={true} href='#'>
          <button className='rounded-full bg-darkGrey px-4 py-1 right-0 flex items-center float-right'>
            <img className='w-8' src='./images/logo-white.png' />
            Start Creating
          </button>
        </Link>
        <div className='relative flex flex-row'>
          <img className='' src='/images/circle1.png' alt='circle1' />
          <img className='' src='/images/circle2.png' alt='circle2' />
          <img src='/images/circle3.png' alt='circle3' />
        </div>
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
            <div className=' space-y-20 h-full flex flex-col'>
              <div className='w-full flex flex-col justify-center items-center mt-10'>
                <Hero />
                <Features />
                {/* <Partners /> */}
                <Footer />
              </div>
            </div>
          </Layout.Body>
        </Layout>
      </>
    )
  }

  return null
}

export default Home
