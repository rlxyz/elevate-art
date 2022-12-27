import { PreviewImageCardStandaloneNoNone } from '@components/collection/CollectionPreviewImage'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import NextLinkComponent from '@components/layout/link/NextLink'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { ArrowCircleRightIcon, CubeIcon, GlobeAltIcon, SelectorIcon } from '@heroicons/react/outline'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Layout, LayoutContainer } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import * as v from 'src/shared/compiler'
import { CollectionNavigationEnum, OrganisationNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'

const Page: NextPage = () => {
  const { all: organisations, current: organisation } = useQueryOrganisationFindAll()
  const router = useRouter()
  const { name, id } = router.query as { name: string; id: string }
  const { all: layers } = useQueryLayerElementFindAll({ repositoryId: id })

  const elements = v.one(
    v.parseLayer(
      layers.map((l) => ({
        ...l,
        traits: l.traitElements
          .filter((x) => !x.readonly)
          .map((t) => ({
            ...t,
            weight: t.weight || 1,
            rules: [...t.rulesPrimary, ...t.rulesSecondary].map(
              ({ condition, primaryTraitElementId: left, secondaryTraitElementId: right }) => ({
                type: condition as v.RulesType,
                with: left === t.id ? right : left,
              })
            ),
          })),
      }))
    ),
    v.seed('', '', 1, '')
  )

  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.New}>
      <Layout hasFooter={false}>
        <Layout.AppHeader>
          <AppRoutesNavbar>
            <AppRoutesNavbar.Item label={capitalize(ZoneNavigationEnum.enum.Create)} href={`/${ZoneNavigationEnum.enum.Create}`}>
              <ZoneRoutesNavbarPopover
                title='Apps'
                routes={[
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Dashboard),
                    href: `/${ZoneNavigationEnum.enum.Dashboard}`,
                    selected: false,
                    icon: (props: any) => <CubeIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Create),
                    href: `/${ZoneNavigationEnum.enum.Create}`,
                    selected: true,
                    icon: (props: any) => <TriangleIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Explore),
                    href: `/${ZoneNavigationEnum.enum.Explore}`,
                    selected: false,
                    icon: (props: any) => <GlobeAltIcon className='w-4 h-4' />,
                  },
                ]}
              />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item label={organisation?.name || ''} href={routeBuilder(organisation?.name)}>
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.Body border='none'>
          <div className='py-20'>
            <div className='pb-28 flex justify-between'>
              <div className='space-y-1'>
                <span className='text-4xl font-bold'>Congratulations!</span>
                <p className='text-sm text-black'>You have a new project to work on.</p>
              </div>
              <div>
                <NextLinkComponent href={`/${organisation?.name}/${name}`}>
                  <div className='py-2 px-4 bg-blueHighlight rounded-[5px] space-x-2 flex items-center'>
                    <h3 className='text-white text-sm'>Continue to Project</h3>
                    <ArrowCircleRightIcon className='w-5 h-5 text-white' />
                  </div>
                </NextLinkComponent>
              </div>
            </div>
            <div className='absolute w-screen left-0 bg-lightGray border-t border-mediumGrey h-[calc(100vh-19.5rem)]'>
              <LayoutContainer className='absolute -top-10' border='none'>
                <div className='grid grid-cols-6 gap-12'>
                  <div className='relative col-span-3 top-10'>
                    <div className='py-4'>
                      <div className='divide-y divide-mediumGrey space-y-6'>
                        <h3 className='text-xs text-darkGrey'>Next Steps</h3>
                        {[
                          {
                            title: 'Preview Project',
                            description: 'View your project and create new collections',
                            href: `/${organisation?.name}/${name}`, // @todo fix this
                            icon: (props: any) => <CubeIcon {...props} />,
                          },
                          {
                            title: 'Set Rarity',
                            description: 'Set the rarity percentages of your traits',
                            href: `/${organisation?.name}/${name}/${CollectionNavigationEnum.enum.Rarity}/${layers[0]?.name}`, // @todo fix this
                            icon: (props: any) => <CubeIcon {...props} />,
                          },
                          {
                            title: 'Create Rules',
                            description: 'Create rules for your project',
                            href: `/${organisation?.name}/${name}/${CollectionNavigationEnum.enum.Rules}`,
                            icon: (props: any) => <SelectorIcon {...props} />,
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
                  <div className='col-span-3'>
                    <div className='w-full h-auto relative inline-flex items-center justify-center aspect-1 border-mediumGrey border rounded-[5px] bg-white'>
                      <PreviewImageCardStandaloneNoNone
                        id={0}
                        elements={elements}
                        collection={{
                          id: '',
                          name: 'reorder',
                          type: '',
                          totalSupply: 1,
                          generations: 1,
                          createdAt: new Date(),
                          updatedAt: new Date(),
                          repositoryId: id,
                        }}
                        layers={layers}
                      />
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
