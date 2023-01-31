// import { Header } from '@components/Layout/Header'
import AvatarComponent from '@components/layout/avatar/Avatar'
import { Layout } from '@components/layout/core/Layout'
import { default as NextLink, default as NextLinkComponent } from '@components/layout/link/NextLink'
import { OrganisationNavigationEnum } from '@utils/enums'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { routeBuilder } from 'src/client/utils/format'

const Profile = () => {
  return (
    <>
      <div className='w-full'>
        <div>
          <img
            className='h-32 w-full object-cover lg:h-48'
            src='https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
            alt=''
          />
        </div>
        <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
          <div className='-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5'>
            <div className='flex'>
              <img className='h-24 w-24 rounded-full ring-8 ring-white sm:h-32 sm:w-32' src='/images/avatar-blank.png' alt='' />
            </div>
          </div>
          <div className='mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1'>
            <div className='mt-6 min-w-0 flex-1 sm:hidden md:block'>
              <h1 className='truncate text-2xl font-bold text-gray-900'>Dream Lab</h1>
            </div>
            <div className='justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4'>
              <div className='grid grid-cols-2 '>
                <div className='font-semibold text-darkGrey text-xs'>Following</div>
                <div className='font-semibold text-darkGrey text-xs border-l border-mediumGrey  pl-4'>Followers</div>
                <div className='text-2xl font-medium '>270</div>
                <div className='text-2xl font-medium border-l border-mediumGrey pl-4'>690</div>
              </div>
            </div>
          </div>
          <button
            type='button'
            className='inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
          >
            {/* <EnvelopeIcon className='-ml-1 mr-2 h-5 w-5 text-gray-400' aria-hidden='true' /> */}
            <span>dreamlab.eth</span>
          </button>
          <button
            type='button'
            className='inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
          >
            {/* <PhoneIcon className='-ml-1 mr-2 h-5 w-5 text-gray-400' aria-hidden='true' /> */}
            <span>Follow</span>
          </button>
          <div className='mt-6 hidden min-w-0 flex-1 sm:block md:hidden'>
            <h1 className='truncate text-2xl font-bold text-gray-900'>NAME</h1>
          </div>
        </div>
      </div>
    </>
  )
}

const Navigation = () => {
  return (
    <div className='flex justify-center items-center w-full'>
      <div className='xs:ml-10 sm:ml-0 grid md:grid-cols-2 place-content-center justify-items-center'>
        <div className='hidden md:block relative w-[100%] sm:w-[50%] md:w-[70%] lg:w-[90%] xl:w-[80%] 2xl:w-[80%]'>
          <Image width={629} height={786} priority src='/images/journey.png' alt='journey-by-jacob' />
        </div>
        <div className='block md:hidden'>
          <Image priority width={3042} height={723} src='/images/logo-banner.png' alt='logo-banner' />
        </div>

        <div className='hidden md:flex flex-col justify-center xs:items-start sm:items-start  w-2/3 space-y-9'>
          <ProjectName />
          <Details />
          <div className='flex space-x-9'>
            <div>
              <div className='text-xs text-darkGrey'>Current Minted</div>
              <div className='text-3xl font-bold'>0/1111</div>
            </div>
            <div>
              <div className='text-xs text-darkGrey'>Phase</div>
              <div className='text-3xl font-bold'>Free Claim</div>
            </div>
          </div>
          <MintButton />
        </div>
      </div>
    </div>
  )
}

const Gallery = () => {
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
        <Layout.AppHeaderWithSearch border='none' authenticated={false} />
        <Layout.Body>
          <div className='min-h-[calc(100vh-7.14rem)] flex items-center'>
            <div className='w-full flex flex-col justify-center items-center space-y-10'>
              <Profile />
              <Navigation />
              <Gallery />
              <Partners />
              <Footer />
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </>
  )
}

export default Home

const ProjectName = () => <h1 className='xs:text-3xl sm:text-5xl font-bold tracking-wide sm:text-left'>Journey</h1>

const Details = () => {
  return (
    <div className='flex space-x-9'>
      <div className='flex flex-col justify-around w-full space-y-2'>
        <p className='font-medium text-darkGrey xs:mb-4 sm:mb-0 text-xs'>Created by</p>
        <button className='drop-shadow-2xl space-x-2 bg-white rounded-[99px] flex p-2'>
          <AvatarComponent src='/images/avatar-blank.png' />
          <p className='text-md font-medium text-semiBold group-hover:text-gray-900'>@dreamlab</p>
        </button>
      </div>
      <div className='flex flex-col justify-around  w-full space-y-2'>
        <p className='font-medium text-darkGrey xs:mb-4 sm:mb-0 text-xs'>Collection</p>
        <button className='drop-shadow-2xl space-x-2 bg-white rounded-[5px] flex p-2'>
          <AvatarComponent src='/images/avatar-blank.png' isSquare />
          <p className='text-md font-medium text-semiBold group-hover:text-gray-900'>journey</p>
        </button>
      </div>
    </div>
  )
}

const MintButton = () => {
  return (
    <NextLinkComponent className='text-white bg-black w-1/2 rounded-[5px] flex items-center justify-center' href={`/dreamlab/journey`}>
      <div className='flex items-center justify-center'>
        <Image width={40} height={40} src='/images/logo-white.png' alt='logo-white' />
        <span className='text-sm'>View Mint</span>
      </div>
    </NextLinkComponent>
  )
}
