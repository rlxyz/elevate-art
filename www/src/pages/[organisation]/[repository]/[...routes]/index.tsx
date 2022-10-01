import CollectionBranchSelectorCard from '@components/Collection/CollectionBranchSelectorCard'
import { GenerateButton } from '@components/Collection/CollectionGenerateCard'
import CollectionPreviewFilters from '@components/Collection/CollectionPreviewFilters'
import CollectionPreviewGrid from '@components/Collection/CollectionPreviewGrid'
import { Layout } from '@components/Layout/Layout'
import LayerFolderSelector from '@components/Repository/RepositoryFolderSelector'
import RepositoryRarityView from '@components/Repository/RepositoryRarityView'
import { RepositoryRuleCreateView } from '@components/Repository/RepositoryRuleCreateView'
import { RepositoryRuleDisplayView } from '@components/Repository/RepositoryRuleDisplayView'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryRepository } from '@hooks/query/useQueryRepository'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useCollectionNavigationStore from '@hooks/store/useCollectionNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CollectionNavigationEnum, CollectionTitleContent } from 'src/types/enums'
import { useRepositoryRoute } from '../../../../hooks/utils/useRepositoryRoute'

const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [hasMounted, setHasMounted] = useState(false)
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryRepositoryLayer()
  const { all: collections, isLoading: isLoadingCollection, mutate } = useQueryRepositoryCollection()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepository()
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisation } = useQueryOrganisation()
  const { mainRepositoryHref, isLoading: isRoutesLoading } = useRepositoryRoute()
  const { setCollectionId, setRepositoryId, setOrganisationId } = useRepositoryStore((state) => {
    return {
      setOrganisationId: state.setOrganisationId,
      setRepositoryId: state.setRepositoryId,
      setCollectionId: state.setCollectionId,
    }
  })
  const currentViewSection = useCollectionNavigationStore((state) => state.currentViewSection)
  const { collectionName } = useRepositoryRoute()
  const isLoading = isLoadingLayers && isLoadingCollection && isLoadingRepository && isRoutesLoading && isLoadingOrganisation

  useEffect(() => {
    if (!organisation) return
    setOrganisationId(organisation.id)
  }, [isLoadingOrganisation])

  useEffect(() => {
    if (!repository) return
    setRepositoryId(repository.id)
  }, [isLoadingRepository])

  useEffect(() => {
    if (!collections) return
    if (!collections.length) return
    const collection = collections.find((collection) => collection.name === collectionName)
    if (!collection) return
    setCollectionId(collection.id)
    mutate({ collection })
  }, [isLoadingCollection])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted ? (
    <Layout>
      <>
        <Layout.Header
          internalRoutes={[
            { current: organisationName, href: `/${organisationName}`, organisations },
            { current: repositoryName, href: `/${organisationName}/${repositoryName}` },
          ]}
          internalNavigation={[
            {
              name: CollectionNavigationEnum.enum.Preview,
              loading: mainRepositoryHref === null || isLoading,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Preview}`,
              enabled: CollectionNavigationEnum.enum.Preview === currentViewSection,
            },
            {
              name: CollectionNavigationEnum.enum.Rarity,
              loading: mainRepositoryHref === null || isLoading,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${layer?.name}`,
              enabled: CollectionNavigationEnum.enum.Rarity === currentViewSection,
            },
            {
              name: CollectionNavigationEnum.enum.Rules,
              loading: mainRepositoryHref === null || isLoading,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rules}/${layer?.name}`,
              enabled: CollectionNavigationEnum.enum.Rules === currentViewSection,
            },
          ]}
        />
        {currentViewSection !== CollectionNavigationEnum.enum.Preview ? (
          <>
            <Layout.Title>
              <main className='pointer-events-auto -ml-2'>
                <div className='flex justify-between items-center h-[10rem] space-y-2'>
                  <div className='flex flex-col space-y-1'>
                    <span className='text-3xl font-semibold'>{CollectionTitleContent[currentViewSection].title}</span>
                    <span className='text-sm text-darkGrey'>{CollectionTitleContent[currentViewSection].description}</span>
                  </div>
                </div>
              </main>
            </Layout.Title>
          </>
        ) : (
          <></>
        )}
        {currentViewSection === CollectionNavigationEnum.enum.Rules ? (
          <Layout.Body border='lower'>
            {layers && currentViewSection === CollectionNavigationEnum.enum.Rules && <RepositoryRuleCreateView />}
            {layers &&
            layers.flatMap((x) => x.traitElements).filter((x) => x.rulesPrimary.length || x.rulesSecondary.length).length &&
            currentViewSection === CollectionNavigationEnum.enum.Rules ? (
              <RepositoryRuleDisplayView />
            ) : null}
          </Layout.Body>
        ) : (
          <Layout.Body border='none'>
            <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
              <div className='col-span-2 py-8 -ml-4'>
                {[CollectionNavigationEnum.enum.Rarity, CollectionNavigationEnum.enum.Rules].includes(currentViewSection) && (
                  <div className='flex flex-col space-y-3 justify-between'>
                    {layers && <LayerFolderSelector layers={layers} />}
                  </div>
                )}
                {currentViewSection === CollectionNavigationEnum.enum.Preview && (
                  <div>
                    <div className='relative flex flex-col space-y-3 justify-between'>
                      <div className='grid grid-cols-8 gap-x-2 w-full h-full'>
                        <div className='col-span-6'>
                          <CollectionBranchSelectorCard />
                        </div>
                        <div className='col-span-2'>
                          <GenerateButton />
                        </div>
                      </div>
                      {/* <CollectionGenerateCard /> */}
                      <CollectionPreviewFilters />
                    </div>
                  </div>
                )}
              </div>
              <div className='col-span-8'>
                <main className='space-y-6 py-8 pl-8'>
                  {currentViewSection === CollectionNavigationEnum.enum.Rarity && <RepositoryRarityView />}
                  {currentViewSection === CollectionNavigationEnum.enum.Preview && <CollectionPreviewGrid />}
                </main>
              </div>
            </div>
          </Layout.Body>
        )}
      </>
    </Layout>
  ) : (
    <></>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context)
//   const token = await getToken({ req: context.req })
//   const userId = token?.sub ?? null
//   if (!userId) return { redirect: { destination: '/404', permanent: false } }
//   const { organisation, repository, collection } = context.query
//   const valid = await prisma.collection.findFirst({
//     where: {
//       name: collection as string,
//       repository: {
//         name: repository as string,
//         organisation: {
//           name: organisation as string,
//           admins: {
//             some: {
//               userId: userId,
//             },
//           },
//         },
//       },
//     },
//   })
//   if (!valid) return { redirect: { destination: `/404`, permanent: false } }
//   return {
//     props: {
//       userId,
//       session,
//     },
//   }
// }

export default Page
