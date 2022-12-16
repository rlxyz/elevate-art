import { Popover, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon, UserIcon } from '@heroicons/react/outline'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import type { Organisation } from '@prisma/client'
import clsx from 'clsx'
import Image from 'next/image'
import { Fragment } from 'react'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { capitalize } from 'src/client/utils/format'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum } from 'src/shared/enums'
import { Link } from '../Link'
import { default as NextLinkComponent } from '../link/NextLink'

type HeaderInternalAppRoutesProps = {
  routes: {
    current: string
    href: string
    organisations?: Organisation[]
  }[]
}

export const HeaderInternalAppRoutes = ({ routes }: HeaderInternalAppRoutesProps) => {
  const { currentHref } = useQueryOrganisationFindAll()
  const setOrganisationId = useOrganisationNavigationStore((state) => state.setOrganisationId)
  return (
    <>
      {routes.map(({ current, href, organisations }, index) => {
        const isLoading = current === ''
        return (
          <div key={index} className='flex items-center justify-center'>
            <Image priority width={30} height={30} src='/images/logo-slash.svg' alt='Logo Slash 1' />
            <Popover className='flex space-x-1'>
              <NextLinkComponent href={href} className='w-fit'>
                {isLoading ? (
                  <div className='w-36 animate-pulse h-5 rounded-[5px] bg-mediumGrey' />
                ) : (
                  <>
                    <div className={clsx(organisations ? 'text-black' : 'text-darkGrey', 'py-1')}>
                      {current === OrganisationNavigationEnum.enum.You || current === OrganisationNavigationEnum.enum.Dashboard
                        ? capitalize(current)
                        : current}
                    </div>
                  </>
                )}
              </NextLinkComponent>
              {organisations ? (
                <>
                  <Popover.Button className='group inline-flex items-center rounded-[5px] text-xs'>
                    <SelectorIcon className='text-black w-4 h-4' />
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
                      <div className='overflow-hidden rounded-[5px] shadow-lg ring-1 ring-black ring-opacity-5'>
                        <div className='py-2 bg-lightGray border-b border-mediumGrey'>
                          <div className='relative rounded-[5px]'>
                            <Link external href={`/${OrganisationNavigationEnum.enum.Dashboard}`}>
                              <div className='pl-2 py-2 pr-4 flex flex-row justify-between items-center w-full text-darkGrey hover:text-black'>
                                <div className='flex space-x-2 items-center'>
                                  {/* <div className='rounded-full h-5 w-5 bg-blueHighlight' /> */}
                                  <UserIcon className='h-3 w-3' />
                                  <span>Your Dashboard</span>
                                </div>
                                {current === OrganisationNavigationEnum.enum.Dashboard ? (
                                  <CheckIcon className='text-blueHighlight h-4 w-4' />
                                ) : (
                                  <></>
                                )}
                              </div>
                            </Link>
                          </div>
                        </div>
                        <div className='p-2 relative bg-white space-y-1'>
                          {organisations.length > 0 ? (
                            <div className='space-y-1'>
                              <span className='text-xs text-darkGrey'>Your Teams</span>
                              <div>
                                {organisations.map(({ name, type, id }) => (
                                  <Link hover enabled={name === current} key={name} href={`/${name}`}>
                                    <div
                                      className='px-2 flex flex-row justify-between items-center w-full'
                                      onClick={() => setOrganisationId(id)}
                                    >
                                      <div className='flex space-x-2 items-center'>
                                        <div className='rounded-full h-5 w-5 bg-blueHighlight' />
                                        <span>
                                          {type === OrganisationDatabaseEnum.enum.Team
                                            ? name
                                            : capitalize(OrganisationNavigationEnum.enum.You)}
                                        </span>
                                      </div>
                                      {name === currentHref && <CheckIcon className='text-blueHighlight h-4 w-4' />}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                          {/* <div className='pt-2'>
                                  <div className='py-1 border border-mediumGrey rounded-[5px] bg-lightGray flex space-x-2 items-center'>
                                    <Button variant='ghost' className='space-x-2'>
                                      <PlusCircleIcon className='text-blueHighlight w-5 h-5' />
                                      <span className='text-black'>Create Team</span>
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
