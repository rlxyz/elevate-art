import LayerFolderSelector from '@components/Collection/CollectionHelpers/LayerFolderSelector'
import { SectionHeader } from '@components/Collection/CollectionHelpers/SectionHeader'
import { Layout } from '@components/Layout/Layout'
import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { useQueryCollection, useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { createManyTokens, getTokenRanking, getTraitMappings } from '@utils/compiler'
import dynamic from 'next/dynamic'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CollectionNavigationEnum, CollectionTitleContent } from 'src/types/enums'
import { useRepositoryRoute } from '../../../../hooks/useRepositoryRoute'

const DynamicCollectionPreview = dynamic(() => import('@components/Collection/CollectionPreview/Index'), {
  ssr: false,
})
const DynamicBranchSelector = dynamic(() => import('@components/Collection/CollectionHelpers/CollectionBranchSelector'), {
  ssr: false,
})
const DynamicCollectionLayers = dynamic(() => import('@components/Collection/CollectionLayers/Index'), {
  ssr: false,
})
const DynamicRegenerateButton = dynamic(() => import('@components/Collection/CollectionHelpers/RegenerateButton'), {
  ssr: false,
})
const DynamicCollectionRules = dynamic(() => import('@components/Collection/CollectionRules/Index'), {
  ssr: false,
})
const DynamicFilter = dynamic(() => import('@components/Collection/CollectionPreview/PreviewFilter'), {
  ssr: false,
})

const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [hasMounted, setHasMounted] = useState(false)
  const { currentLayer, isLoading } = useCurrentLayer()
  const currentViewSection = useCollectionNavigationStore((state) => state.currentViewSection)
  const { mainRepositoryHref, isLoading: isRoutesLoading } = useRepositoryRoute()
  const { data: collection } = useQueryCollection()
  const { data: layers } = useQueryRepositoryLayer()
  const { setTokens, setTraitMapping, rarityFilter, setTokenRanking } = useRepositoryStore((state) => {
    return {
      rarityFilter: state.rarityFilter,
      setTokens: state.setTokens,
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
    }
  })

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!collection || !layers) return
    const tokens = createManyTokens(layers, collection.totalSupply, collection.name, collection.generations)
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    const rankings = getTokenRanking(tokens, traitMap, collection.totalSupply)
    setTokenRanking(rankings)
    setTokens(
      rankings.slice(
        rarityFilter === 'Top 10'
          ? 0
          : rarityFilter === 'Middle 10'
          ? parseInt((rankings.length / 2 - 5).toFixed(0))
          : rarityFilter === 'Bottom 10'
          ? rankings.length - 10
          : 0,
        rarityFilter === 'Top 10'
          ? 10
          : rarityFilter === 'Middle 10'
          ? parseInt((rankings.length / 2 + 5).toFixed(0))
          : rarityFilter === 'Bottom 10'
          ? rankings.length
          : rankings.length
      )
    )
  }, [collection?.generations])

  return hasMounted ? (
    <Layout>
      <>
        <Layout.Header
          internalRoutes={[
            { current: organisationName, href: `/${organisationName}`, options: [organisationName] },
            { current: repositoryName, href: `/${organisationName}/${repositoryName}` },
          ]}
          internalNavigation={[
            {
              name: CollectionNavigationEnum.enum.Preview,
              loading: mainRepositoryHref === null || isLoading || isRoutesLoading,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Preview}`,
              enabled: CollectionNavigationEnum.enum.Preview === currentViewSection,
            },
            {
              name: CollectionNavigationEnum.enum.Rarity,
              loading: mainRepositoryHref === null || isLoading || isRoutesLoading,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${currentLayer.name}`,
              enabled: CollectionNavigationEnum.enum.Rarity === currentViewSection,
            },
            {
              name: CollectionNavigationEnum.enum.Rules,
              loading: mainRepositoryHref === null || isLoading || isRoutesLoading,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rules}/${currentLayer.name}`,
              enabled: CollectionNavigationEnum.enum.Rules === currentViewSection,
            },
          ]}
        />
        {currentViewSection !== CollectionNavigationEnum.enum.Preview ? (
          <>
            <Layout.Title>
              <SectionHeader
                title={CollectionTitleContent[currentViewSection].title}
                description={CollectionTitleContent[currentViewSection].description}
              />
            </Layout.Title>
          </>
        ) : (
          <></>
        )}
        <Layout.Body>
          <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
            <div className='col-span-2 py-8 -ml-4'>
              {[CollectionNavigationEnum.enum.Rarity, CollectionNavigationEnum.enum.Rules].includes(currentViewSection) && (
                <div className='flex flex-col space-y-6 justify-between'>{layers && <LayerFolderSelector layers={layers} />}</div>
              )}
              {currentViewSection === CollectionNavigationEnum.enum.Preview && (
                <div>
                  <div className='relative flex flex-col space-y-3 justify-between'>
                    <DynamicBranchSelector />
                    <DynamicRegenerateButton />
                    <DynamicFilter />
                  </div>
                </div>
              )}
            </div>
            <div className='col-span-8'>
              {currentViewSection === CollectionNavigationEnum.enum.Rarity && <DynamicCollectionLayers />}
              {currentViewSection === CollectionNavigationEnum.enum.Preview && <DynamicCollectionPreview />}
              {currentViewSection === CollectionNavigationEnum.enum.Rules && <DynamicCollectionRules />}
            </div>
          </div>
        </Layout.Body>
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
