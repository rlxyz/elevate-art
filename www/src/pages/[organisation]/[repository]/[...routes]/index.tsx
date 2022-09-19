import { SectionHeader } from '@components/Collection/CollectionHelpers/SectionHeader'
import Index from '@components/Collection/Index'
import { Layout } from '@components/Layout/Layout'
import Loading from '@components/UI/Loading'
import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { useDeepCompareEffect } from '@hooks/useDeepCompareEffect'
import { useKeybordShortcuts } from '@hooks/useKeyboardShortcuts'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { trpc } from '@utils/trpc'
import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CollectionNavigationEnum, CollectionTitleContent } from 'src/types/enums'
import { prisma } from '../../../../server/db/client'

// wrapper to hydate organisation & repository data
const PageImplementation = ({
  collectionName,
  repositoryName,
  routes,
}: {
  repositoryName: string
  collectionName: string
  routes: any
}) => {
  useKeybordShortcuts()
  const router: NextRouter = useRouter()
  const { data: repositoryData } = trpc.useQuery(['repository.getRepositoryByName', { name: repositoryName }])
  const { setLayerIds, setLayerNames, layerNames, layerIds, setCollectionId, setRepositoryId } = useRepositoryStore((state) => {
    return {
      setRepositoryId: state.setRepositoryId,
      setCollectionId: state.setCollectionId,
      setLayerIds: state.setLayerIds,
      setLayerNames: state.setLayerNames,
      layerIds: state.layerIds,
      layerNames: state.layerNames,
    }
  })

  const { setCurrentLayerPriority, setCurrentViewSection } = useCollectionNavigationStore((state) => {
    return {
      setCurrentLayerPriority: state.setCurrentLayerPriority,
      setCurrentViewSection: state.setCurrentViewSection,
    }
  })

  // sync routing with store
  useDeepCompareEffect(() => {
    if (!layerNames || layerNames.length === 0 || !routes) return

    const parse = CollectionNavigationEnum.safeParse(routes[0])
    if (!parse.success) {
      router.push('/404')
      return
    }

    if (routes.length === 1) {
      const route = parse.data

      switch (route) {
        case CollectionNavigationEnum.enum.Preview:
          setCurrentViewSection(parse.data)
          return
        case CollectionNavigationEnum.enum.Settings:
          setCurrentViewSection(parse.data)
          return
      }

      router.push('/404')
    }

    if (routes.length == 2) {
      const name: string = routes[1] as string
      const layer = layerNames.filter((layer) => layer === name)[0]

      if (!layer) {
        router.push('/404')
        return
      }

      setCurrentViewSection(parse.data)
      setCurrentLayerPriority(layerNames.findIndex((layer) => layer == name)) // fix!
      return
    }

    router.push('/404')
  }, [routes, layerNames])

  // sync repository to store
  useDeepCompareEffect(() => {
    if (!repositoryData) return
    if (!repositoryData.collections) return
    const layers = repositoryData.layers
    const collection = repositoryData.collections?.find((collection) => collection.name === collectionName)
    if (!collection) return
    if (!layers || layers.length == 0) return
    setLayerIds(layers.map((layer) => layer.id))
    setLayerNames(layers.map((layer) => layer.name))
    setRepositoryId(repositoryData.id)
    setCollectionId(collection.id)
  }, [repositoryData, collectionName])

  return <Index />
}

// wrapper to hydate routes
const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const collectionName: string = (router.query.collection as string) || 'main'
  const repositoryName: string = router.query.repository as string
  const routes: string | string[] | undefined = router.query.routes
  const [hasHydrated, setHasHydrated] = useState<boolean>(false)
  const { currentLayer } = useCurrentLayer()
  const currentViewSection = useCollectionNavigationStore((state) => state.currentViewSection)

  useEffect(() => {
    setHasHydrated(Boolean(organisationName) && Boolean(repositoryName) && Boolean(collectionName))
  }, [organisationName, repositoryName, collectionName])

  return hasHydrated ? (
    <Layout>
      <Layout.Header
        internalRoutes={[
          { current: organisationName, href: `/${organisationName}` },
          { current: repositoryName, options: [repositoryName], href: `/${organisationName}/${repositoryName}` },
        ]}
        internalNavigation={[
          {
            name: CollectionNavigationEnum.enum.Preview,
            href: `/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Preview}`,
            enabled: CollectionNavigationEnum.enum.Preview === currentViewSection,
          },
          {
            name: CollectionNavigationEnum.enum.Layers,
            href: `/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Layers}/${currentLayer.name}`,
            enabled: CollectionNavigationEnum.enum.Layers === currentViewSection,
          },
          {
            name: CollectionNavigationEnum.enum.Rarity,
            href: `/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Rarity}/${currentLayer.name}`,
            enabled: CollectionNavigationEnum.enum.Rarity === currentViewSection,
          },
          {
            name: CollectionNavigationEnum.enum.Rules,
            href: `/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Rules}/${currentLayer.name}`,
            enabled: CollectionNavigationEnum.enum.Rules === currentViewSection,
          },
        ]}
      />
      <Layout.Title>
        <SectionHeader
          title={CollectionTitleContent[currentViewSection].title}
          description={CollectionTitleContent[currentViewSection].description}
        />
      </Layout.Title>
      <Layout.Body>
        <PageImplementation repositoryName={repositoryName} collectionName={collectionName} routes={routes} />
      </Layout.Body>
    </Layout>
  ) : (
    <Loading />
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const token = await getToken({ req: context.req })
  const userId = token?.sub ?? null
  if (!userId) return { redirect: { destination: '/', permanent: false } }
  const { organisation, repository, collection } = context.query
  const valid = await prisma.collection.findFirst({
    where: {
      name: collection as string,
      repository: {
        name: repository as string,
        organisation: {
          name: organisation as string,
          admins: {
            some: {
              userId: userId,
            },
          },
        },
      },
    },
  })
  if (!valid) return { redirect: { destination: `/404`, permanent: false } }
  return {
    props: {
      userId,
      session,
    },
  }
}

export default Page
