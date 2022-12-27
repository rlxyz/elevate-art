import { Layout } from '@components/layout/core/Layout'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import LoadingComponent from '@components/layout/loading/Loading'
import { OrganisationAuthLayout } from '@components/organisation/OrganisationAuthLayout'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import { LayerElementReorder } from '@components/repository/LayerElementFileTree/LayerElementReorder'
import withOrganisationStore from '@components/withOrganisationStore'
import { ArrowCircleRightIcon, CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { useMutateLayerElementUpdateOrder } from '@hooks/trpc/layerElement/useMutateLayerElementUpdateOrder'
import type { LayerElement } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { OrganisationNavigationEnum, ZoneNavigationEnum } from '@utils/enums'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import { FormHeader, FormLayout, FormStepEnum, FormSteps } from '.'

const Page: NextPage = () => {
  const router = useRouter()
  const { name, id } = router.query as { name: string; id: string }
  const { all: organisations, current: organisation } = useQueryOrganisationFindAll()
  const { current: repository } = useQueryRepositoryFindByName({
    organisationName: organisation?.name || '',
    repositoryName: name,
  })
  const { all: layerElements } = useQueryLayerElementFindAll({
    repositoryId: id || '',
  })
  const sorted = layerElements.sort((a, b) => a.priority - b.priority)
  const [items, setItems] = useState<LayerElement[]>(sorted)
  const { mutate, isLoading } = useMutateLayerElementUpdateOrder()
  useEffect(() => {
    setItems(layerElements)
  }, [sorted.length])

  if (!repository) return null

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
            <>
              <FormHeader
                title="You're are almost done."
                description='Time to change the priority of your layers to ensure your art aligns properly'
              >
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    mutate(
                      {
                        layerElements: items.map(({ id }, index) => ({
                          layerElementId: id,
                          priority: index,
                        })),
                      },
                      {
                        onSuccess: () => {
                          router.push(`/${organisation?.name}/new/success?name=${name}&id=${id}`)
                        },
                      }
                    )
                  }}
                  disabled={isLoading}
                  className='py-2 px-4 bg-blueHighlight rounded-[5px] border border-mediumGrey space-x-2 flex items-center text-white text-xs disabled:cursor-not-allowed disabled:bg-lightGray disabled:text-darkGrey'
                >
                  {isLoading ? (
                    <div className='flex flex-row w-20 items-center'>
                      <span>Saving</span>
                      <LoadingComponent />
                    </div>
                  ) : (
                    <div className='flex space-x-2'>
                      <h3 className='text-white text-sm'>Continue</h3>
                      <ArrowCircleRightIcon className='w-5 h-5 text-white' />
                    </div>
                  )}
                </button>
              </FormHeader>
              <FormLayout className='grid grid-cols-7 gap-12'>
                <FormSteps className='col-span-2 divide-y divide-mediumGrey space-y-12' currentStep={FormStepEnum.enum.OrderLayer} />
                <LayerElementReorder
                  className='col-span-5'
                  repository={repository}
                  layerElements={layerElements}
                  items={items}
                  setItems={setItems}
                />
              </FormLayout>
            </>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
