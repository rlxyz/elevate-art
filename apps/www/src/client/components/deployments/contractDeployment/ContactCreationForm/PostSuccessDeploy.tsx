import { LayoutContainer } from '@components/layout/core/Layout'
import NextLinkComponent from '@components/layout/link/NextLink'
import { ArrowCircleRightIcon, CubeIcon } from '@heroicons/react/outline'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { CollectionNavigationEnum, ZoneNavigationEnum } from '@utils/enums'
import { routeBuilder } from 'src/client/utils/format'

const PostSuccessDeploy = () => {
  const { current: organisation } = useQueryOrganisationFindAll()

  return (
    <div className='absolute w-screen left-0 bg-lightGray border-t border-mediumGrey h-full'>
      <LayoutContainer className='absolute -top-10' border='none'>
        <div className='grid grid-cols-6 gap-12'>
          <div className='relative col-span-3 top-10'>
            <div className='py-4'>
              <div className='divide-y divide-mediumGrey space-y-6'>
                <h3 className='text-xs text-darkGrey'>Deploy Contract</h3>
                {[
                  {
                    title: 'Go to Mint',
                    description: 'View your project and create new collections',
                    href: routeBuilder(organisation?.name, ZoneNavigationEnum.enum.Create),
                    icon: (props: React.ComponentProps<'svg'>) => <CubeIcon {...props} />,
                  },
                  {
                    title: 'Add addresses into the whitelist',
                    description: 'Set the rarity percentages of your traits',
                    href: routeBuilder(organisation?.name, ZoneNavigationEnum.enum.Create, CollectionNavigationEnum.enum.Rarity),
                    icon: (props: React.ComponentProps<'svg'>) => <CubeIcon {...props} />,
                  },
                  {
                    title: 'View your Contract on Etherscan',
                    description: 'Set the rarity percentages of your traits',
                    href: routeBuilder(organisation?.name, ZoneNavigationEnum.enum.Create, CollectionNavigationEnum.enum.Rarity),
                    icon: (props: React.ComponentProps<'svg'>) => <CubeIcon {...props} />,
                  },
                ].map((item) => (
                  <div key={item.title} className='pt-6 flex justify-between items-center'>
                    <div className='space-y-2'>
                      <div className='flex flex-row space-x-1 items-center'>
                        <item.icon className='h-5 w-5' />
                        <span className='font-semibold text-sm'>{item.title}</span>
                      </div>
                      <p className='text-xs text-darkGrey'>{item.description}</p>
                    </div>
                    <NextLinkComponent href={item.href} rel='noreferrer nofollow' target='_blank' className='w-fit'>
                      <ArrowCircleRightIcon className='w-5 h-5 text-darkGrey' />
                    </NextLinkComponent>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </LayoutContainer>
    </div>
  )
}
