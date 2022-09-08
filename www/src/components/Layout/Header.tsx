import { ConnectButton } from '@components/UI/ConnectButton'
import { Link } from '@components/UI/Link'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Fragment, ReactNode } from 'react'

const externalRoutes = [
  {
    name: 'Docs',
    href: 'https://docs.elevate.art',
  },
]

const socialRoutes = [
  {
    name: 'Twitter',
    href: 'https://twitter.elevate.art',
    icon: (props: any) => (
      <svg fill='currentColor' viewBox='0 0 24 24' {...props}>
        <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.elevate.art',
    icon: (props: any) => (
      <svg fill='currentColor' viewBox='0 0 24 24' {...props}>
        <path
          fillRule='evenodd'
          d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
          clipRule='evenodd'
        />
      </svg>
    ),
  },
  {
    name: 'Discord',
    href: 'https://discord.elevate.art',
    icon: (props: any) => (
      <svg fill='currentColor' width='16' height='16' viewBox='0 0 71 55' {...props}>
        <path
          d='M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z'
          fillRule='evenodd'
          clipRule='evenodd'
        />
      </svg>
    ),
  },
]

interface NavigationProps {
  links: { name: string; enabled: boolean; href: string }[]
}

export const Navigation = ({ links }: NavigationProps) => {
  return (
    <aside className='-ml-5'>
      <ul className='flex list-none'>
        {links.map(({ name, enabled, href }, index: number) => {
          return (
            <li key={index} className={enabled ? 'flex space-between items-center relative' : ''}>
              <div className='mb-1'>
                <Link enabled={enabled} title={name} size='md' href={href}></Link>
              </div>
              {enabled && (
                <motion.div
                  className='absolute bg-black mx-3 h-[2px] bottom-[-1px] left-0 right-0'
                  layoutId='underline'
                />
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

type HeaderInternalRoutesProp = {
  routes: {
    current: string
    href: string
    options?: string[]
  }[]
}

const HeaderInternalRoutes = ({ routes }: HeaderInternalRoutesProp) => {
  if (!routes.length) return <></>
  return (
    <>
      {routes.map(({ current, href, options }, index) => {
        return (
          <div key={index} className='flex items-center justify-center'>
            <Image priority width={30} height={30} src='/images/logo-slash.svg' alt='Logo Slash 1' />
            {options ? (
              <Popover className='relative'>
                <Popover.Button className='group inline-flex items-center rounded-[5px] text-xs focus:ring-offset-2'>
                  <span className='text-black text-xs font-semibold'>{current}</span>
                  <ChevronDownIcon className='ml-1 h-3 w-3' aria-hidden='true' />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-200'
                  enterFrom='opacity-0 translate-y-1'
                  enterTo='opacity-100 translate-y-0'
                  leave='transition ease-in duration-150'
                  leaveFrom='opacity-100 translate-y-0'
                  leaveTo='opacity-0 translate-y-1'
                >
                  <Popover.Panel className='absolute left-1/4 z-10 w-screen max-w-xs -translate-x-1/4 transform'>
                    <div className='overflow-hidden rounded-[5px] shadow-lg ring-1 ring-black ring-opacity-5'>
                      <div className='p-2 relative bg-white'>
                        {options.map((item) => (
                          <Link
                            hover
                            pascalCase={false}
                            title={item}
                            enabled={item === current}
                            key={item}
                            href={item}
                          />
                        ))}
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            ) : (
              <Link href={href} enabled={false} external>
                <div className='text-darkGrey'>{current}</div>
              </Link>
            )}
          </div>
        )
      })}
    </>
  )
}

const HeaderExternalaRoutes = ({
  routes,
  children,
}: {
  routes: { name: string; href: string }[]
  children: ReactNode
}) => {
  return (
    <div className='flex flex-row justify-center items-center space-x-3'>
      <aside className='flex flex-row items-center justify-center space-x-3'>
        {routes.map((item, index) => {
          return (
            <Link external={true} key={index} href={item.href}>
              <span className='cursor-pointer hover:text-black text-xs text-darkGrey'>{item.name}</span>
            </Link>
          )
        })}
      </aside>
      {children}
    </div>
  )
}

export const Header = ({
  children,
  internalRoutes = [],
  internalNavigation = [],
  connectButton = false,
}: {
  children?: ReactNode
  internalRoutes?: {
    current: string
    href: string
    options?: string[]
  }[]
  connectButton?: boolean
  internalNavigation?: { name: string; enabled: boolean; href: string }[]
}) => {
  console.log(internalRoutes)
  return (
    <header className='pointer-events-auto'>
      <div className='flex justify-between items-center h-[3.5rem]'>
        <div className='flex items-center text-xs font-semibold space-x-1'>
          <Link className='' external={true} href='/'>
            <Image priority width={50} height={50} src='/images/logo-black.png' alt='Logo' />
          </Link>
          <HeaderInternalRoutes routes={internalRoutes} />
        </div>
        <HeaderExternalaRoutes routes={externalRoutes}>
          {socialRoutes.map((item, index) => (
            <div key={index} className='cursor-pointer'>
              <Link external={true} href={item.href}>
                <item.icon className='h-4 w-4 text-darkGrey' aria-hidden='true' />
              </Link>
            </div>
          ))}
          {connectButton && <ConnectButton />}
        </HeaderExternalaRoutes>
      </div>
      {internalNavigation && <Navigation links={internalNavigation} />}
    </header>
  )
}
