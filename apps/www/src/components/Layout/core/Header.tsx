import { EthereumConnectButton } from '@elevateart/eth-auth'
import { Avatar, externalRoutes, socialRoutes } from '@elevateart/ui'
import { Popover, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon, UserIcon } from '@heroicons/react/outline'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { Organisation } from '@prisma/client'
import { capitalize } from '@utils/format'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Fragment } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'
import Link from '../Link'

const HeaderExternalRoutes = () => {
  return (
    <div className='flex flex-row justify-center items-center space-x-3'>
      <aside className='flex flex-row items-center justify-center space-x-3'>
        {externalRoutes.map((item) => {
          return (
            <Link key={item.name} href={item.href} rel='noreferrer nofollow' target='_blank'>
              <span className='cursor-pointer hover:text-foreground text-xs text-accents_5'>{item.name}</span>
            </Link>
          )
        })}
      </aside>
      {socialRoutes.map((item) => (
        <Link key={item.name} href={item.href} rel='noreferrer nofollow' target='_blank'>
          {item.icon ? (
            <item.icon className='h-4 w-4 cursor-pointer hover:text-foreground text-xs text-accents_5' aria-hidden='true' />
          ) : null}
        </Link>
      ))}
      <EthereumConnectButton>
        <Avatar src='/images/avatar-blank.png' />
      </EthereumConnectButton>
    </div>
  )
}

type HeaderInternalAppRoutesProps = {
  routes: {
    current: string
    href: string
    organisations?: Organisation[]
  }[]
}

const HeaderInternalAppRoutes = ({ routes }: HeaderInternalAppRoutesProps) => {
  const { currentHref } = useQueryOrganisation()
  const { setOrganisationId } = useOrganisationNavigationStore((state) => {
    return {
      setOrganisationId: state.setOrganisationId,
    }
  })

  if (!routes.length) return <></>
  return (
    <>
      {routes.map(({ current, href, organisations }, index) => {
        // const isLoading = current === ''
        return (
          <div key={index} className='flex items-center justify-center'>
            <Image priority width={30} height={30} src='/images/logo-slash.svg' alt='Logo Slash 1' />
            <Popover className='flex space-x-1'>
              <Link href={href}>
                {current === OrganisationNavigationEnum.enum.You || current === OrganisationNavigationEnum.enum.Dashboard
                  ? capitalize(current)
                  : current}
                {/* {isLoading ? (
                  <div className='w-36 animate-pulse h-5 rounded-[5px] bg-accents_7' />
                ) : (
                  <>
                    <div className={clsx(organisations ? 'text-foreground' : 'text-accents_5', 'py-1')}>
                      {current === OrganisationNavigationEnum.enum.You || current === OrganisationNavigationEnum.enum.Dashboard
                        ? capitalize(current)
                        : current}
                    </div>
                  </>
                )} */}
              </Link>
              {organisations ? (
                <>
                  <Popover.Button className='group inline-flex items-center rounded-[5px] text-xs'>
                    <SelectorIcon className='text-foreground w-4 h-4' />
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
                    <Popover.Panel className='absolute z-10 w-screen py-6 max-w-xs'>
                      <div className='overflow-hidden rounded-[5px] shadow-lg ring-1 ring-border ring-opacity-5'>
                        <div className='py-2 bg-accents_8 border-b border-border'>
                          <div className='relative rounded-[5px]'>
                            <Link href={`/${OrganisationNavigationEnum.enum.Dashboard}`}>
                              <div className='pl-2 py-2 pr-4 flex flex-row justify-between items-center w-full text-accents_5 hover:text-foreground'>
                                <div className='flex space-x-2 items-center'>
                                  {/* <div className='rounded-full h-5 w-5 bg-success' /> */}
                                  <UserIcon className='h-3 w-3' />
                                  <span>Your Dashboard</span>
                                </div>
                                {current === OrganisationNavigationEnum.enum.Dashboard ? (
                                  <CheckIcon className='text-success h-4 w-4' />
                                ) : (
                                  <></>
                                )}
                              </div>
                            </Link>
                          </div>
                        </div>
                        <div className='p-2 relative bg-background space-y-1'>
                          {organisations.length > 0 ? (
                            <div className='space-y-1'>
                              <span className='text-xs text-accents_5'>Your Teams</span>
                              <div>
                                {organisations.map(({ name, type, id }) => (
                                  <Link block key={name} href={`/${name}`} className='flex items-center'>
                                    <Avatar src='/images/avatar-blank.png' />
                                    {/* <div
                                      className='px-2 flex flex-row justify-between items-center w-full'
                                      onClick={() => setOrganisationId(id)}
                                    >
                                      <div className='flex space-x-2 items-center'>
                                        <div className='rounded-full h-5 w-5 bg-success' />
                                        <span>
                                          {type === OrganisationDatabaseEnum.enum.Team
                                            ? name
                                            : capitalize(OrganisationNavigationEnum.enum.You)}
                                        </span>
                                      </div>
                                      {name === currentHref && <CheckIcon className='text-success h-4 w-4' />}
                                    </div> */}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                          {/* <div className='pt-2'>
                            <div className='py-1 border border-border rounded-[5px] bg-accents_8 flex space-x-2 items-center'>
                              <Button variant='ghost' className='space-x-2'>
                                <PlusCircleIcon className='text-success w-5 h-5' />
                                <span className='text-foreground'>Create Team</span>
                              </Button>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              ) : null}
            </Popover>
          </div>
        )
      })}
    </>
  )
}

export interface HeaderInternalPageRoutesProps {
  links: { name: string; enabled: boolean; href: string; loading: boolean }[]
}

const HeaderInternalPageRoutes = ({ links }: HeaderInternalPageRoutesProps) => {
  return (
    <nav>
      <ul className='flex list-none'>
        {links.map(({ name, enabled, href, loading }, index: number) => {
          return (
            <li key={index} className={clsx(enabled && 'flex space-between items-center relative')}>
              <div className={clsx('mb-1', loading && 'pointer-events-none')}>
                <Link block href={href} className='text-xs'>
                  <span className={clsx(enabled && 'font-semibold')}>{capitalize(name)}</span>
                </Link>
              </div>
              {enabled && (
                <motion.div className='absolute bg-foreground mx-3 h-[2px] bottom-[-1px] left-0 right-0' layoutId='underline' />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export interface HeaderProps {
  internalRoutes?: {
    current: string
    href: string
    organisations?: Organisation[]
  }[]
  connectButton?: boolean
  internalNavigation?: { name: string; enabled: boolean; href: string; loading: boolean }[]
}

const Index = ({ internalRoutes = [], internalNavigation = [] }: HeaderProps) => {
  return (
    <header className='pointer-events-auto'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center text-xs font-semibold space-x-1'>
          <div className='relative w-12 h-12'>
            <Link href='/'>
              <Image priority layout='fill' src='/images/logo-black.png' alt='elevate-art-logo' />
            </Link>
          </div>
          <HeaderInternalAppRoutes routes={internalRoutes} />
        </div>
        <HeaderExternalRoutes />
      </div>
      <HeaderInternalPageRoutes links={internalNavigation} />
    </header>
  )
}

export default Index
