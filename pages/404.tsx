import { Layout } from '@components/Layout/Layout'
import Error from 'next/error'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Layout>
      <div className='flex flex-col items-center justify-center h-[calc(100vh-5rem)] w-full'>
        <div className='w-full min-h-full flex flex-col lg:relative'>
          <div className='flex-grow flex flex-col'>
            <main className='flex-grow flex flex-col bg-white'>
              <div className='flex-grow mx-auto max-w-7xl w-full flex flex-col px-4 sm:px-6 lg:px-8'>
                <div className='flex-shrink-0 my-auto py-16 sm:py-32'>
                  <p className='text-base font-semibold text-indigo-600'>404</p>
                  <h1 className='mt-2 text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl sm:tracking-tight'>
                    Page not found
                  </h1>
                  <p className='mt-2 text-base text-gray-500'>
                    Sorry, we couldn’t find the page you’re looking for.
                  </p>
                  <div className='mt-6'>
                    <Link
                      href='/'
                      className='text-base font-medium text-indigo-600 hover:text-indigo-500'
                    >
                      <div>
                        Go back home<span aria-hidden='true'> &rarr;</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
          <div className='hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2'>
            <img
              className='absolute inset-0 h-full w-full object-cover'
              src='https://2hgmgkliytraizr4tldhdvzg6dxtcbzweirhbcgixuayjrku3weq.arweave.net/0czDKWjE4gRmPJrGcdcm8O8xBzYiInCIyL0BhMVU3Yk'
              alt='subtraction-by-thankyoux'
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
