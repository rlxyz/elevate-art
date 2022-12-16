import NextLinkComponent from '@components/layout/link/NextLink'
import withOrganisationStore from '@components/withOrganisationStore'
import { ArrowCircleRightIcon, CubeIcon, DatabaseIcon, SelectorIcon } from '@heroicons/react/outline'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import type { NextPage } from 'next'
import { Layout, LayoutContainer } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { OrganisationNavigationEnum } from 'src/shared/enums'

const Page: NextPage = () => {
  const { all: organisations, current: organisation } = useQueryOrganisationFindAll()

  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.New}>
      <Layout hasFooter={false}>
        <Layout.Header
          border='none'
          internalRoutes={[
            {
              current: organisation?.name || '',
              href: `/${organisation?.name}`,
              organisations,
            },
          ]}
        />
        <Layout.Body border='none'>
          <div className='py-20'>
            <div className='pb-28 flex justify-between'>
              <div className='space-y-1'>
                <span className='text-4xl font-bold'>Congratulations!</span>
                <p className='text-sm text-black'>You have a new project to work on.</p>
              </div>
              <div>
                <NextLinkComponent>
                  <div className='py-2 px-4 bg-blueHighlight rounded-[5px] space-x-2 flex items-center'>
                    <h3 className='text-white text-sm'>Continue to Project</h3>
                    <ArrowCircleRightIcon className='w-5 h-5 text-white' />
                  </div>
                </NextLinkComponent>
              </div>
            </div>
            <div className='absolute w-screen left-0 bg-lightGray border-t border-mediumGrey h-[calc(100vh-20rem)]'>
              <LayoutContainer className='absolute -top-10'>
                <div className='grid grid-cols-6 gap-12'>
                  <div className='relative col-span-2 top-10'>
                    <div className='py-4'>
                      <div className='divide-y divide-mediumGrey space-y-6'>
                        <h3 className='text-xs text-darkGrey'>Next Steps</h3>
                        {[
                          {
                            title: 'Set Rarity',
                            description: 'Set the rarity percentages of your traits',
                            href: '/',
                            icon: (props: any) => <CubeIcon {...props} />,
                          },
                          {
                            title: 'Create Rules',
                            description: 'Create rules for your project',
                            href: '/',
                            icon: (props: any) => <SelectorIcon {...props} />,
                          },
                          {
                            title: 'Deploy Contract',
                            description: 'Deploy your project onto Ethereum or Goerli',
                            href: '/',
                            icon: (props: any) => <DatabaseIcon {...props} />,
                          },
                        ].map((item) => (
                          <div className='pt-6 flex justify-between items-center'>
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
                  <div className='col-span-4 '>
                    <div className='h-96 border-mediumGrey border rounded-[5px] bg-white p-3'>
                      <div className='border border-mediumGrey rounded-[5px] h-full w-full'>Hi</div>
                    </div>
                  </div>
                </div>
              </LayoutContainer>
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
