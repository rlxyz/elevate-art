import { SectionHeader } from '@components/Collection/CollectionHelpers/SectionHeader'
import Index from '@components/Collection/Index'
import { Header } from '@components/Layout/Header'
import { Layout } from '@components/Layout/Layout'
import Loading from '@components/UI/Loading'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { useKeybordShortcuts } from '@hooks/useKeyboardShortcuts'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { trpc } from '@utils/trpc'
import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { LayerSectionEnum } from 'src/types/enums'

// wrapper to hydate organisation & repository data
const PageImplementation = ({
  organisationName,
  collectionName,
  repositoryName,
  routes,
}: {
  organisationName: string
  repositoryName: string
  collectionName: string
  routes: any
}) => {
  useKeybordShortcuts()
  const router: NextRouter = useRouter()
  const { data: repositoryData } = trpc.useQuery(['repository.getRepositoryByName', { name: repositoryName }])
  const { setLayerIds, setLayerNames, layerNames, layerIds, setCollectionId, setRepositoryId } = useRepositoryStore(
    (state) => {
      return {
        setRepositoryId: state.setRepositoryId,
        setCollectionId: state.setCollectionId,
        setLayerIds: state.setLayerIds,
        setLayerNames: state.setLayerNames,
        layerIds: state.layerIds,
        layerNames: state.layerNames,
      }
    }
  )

  const { setCurrentLayerPriority, setCurrentViewSection } = useRepositoryRouterStore((state) => {
    return {
      setCurrentLayerPriority: state.setCurrentLayerPriority,
      setCurrentViewSection: state.setCurrentViewSection,
    }
  })

  // sync routing with store
  useEffect(() => {
    if (!layerNames || layerNames.length === 0 || !routes) return

    const parse = LayerSectionEnum.safeParse(routes[0])
    if (!parse.success) {
      router.push('/404')
      return
    }

    if (routes.length === 1) {
      const route = parse.data

      switch (route) {
        case LayerSectionEnum.enum.Preview:
          setCurrentViewSection(parse.data)
          return
        case LayerSectionEnum.enum.Settings:
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
  useEffect(() => {
    if (!repositoryData) return
    if (!repositoryData.collections) return
    const layers = repositoryData.layers
    const collection = repositoryData.collections[0]
    if (!collection) return
    if (!layers || layers.length == 0) return
    setLayerIds(layers.map((layer) => layer.id))
    setLayerNames(layers.map((layer) => layer.name))
    setRepositoryId(repositoryData.id)
    setCollectionId(collection.id)
  }, [repositoryData])

  return <Index />
}

// wrapper to hydate routes
const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const collectionName: string = router.query.collection as string
  const repositoryName: string = router.query.repository as string
  const routes: string | string[] | undefined = router.query.routes
  const [hasHydrated, setHasHydrated] = useState<boolean>(false)
  const { currentLayer } = useCurrentLayer()
  const currentViewSection = useRepositoryRouterStore((state) => state.currentViewSection)

  useEffect(() => {
    setHasHydrated(Boolean(organisationName) && Boolean(repositoryName) && Boolean(collectionName))
  }, [organisationName, repositoryName, collectionName])

  return hasHydrated ? (
    <Layout>
      <Layout.Header>
        <Header
          internalRoutes={[
            { current: organisationName, href: `${organisationName}` },
            { current: repositoryName, href: `${organisationName}/${repositoryName}` },
            { current: collectionName, options: ['main'], href: `` },
          ]}
          internalNavigation={[
            {
              name: LayerSectionEnum.enum.Preview,
              href: `/${organisationName}/${repositoryName}/${collectionName}/${LayerSectionEnum.enum.Preview}`,
              enabled: LayerSectionEnum.enum.Preview === currentViewSection,
            },
            {
              name: LayerSectionEnum.enum.Layers,
              href: `/${organisationName}/${repositoryName}/${collectionName}/${LayerSectionEnum.enum.Layers}/${currentLayer.name}`,
              enabled: LayerSectionEnum.enum.Layers === currentViewSection,
            },
            {
              name: LayerSectionEnum.enum.Rarity,
              href: `/${organisationName}/${repositoryName}/${collectionName}/${LayerSectionEnum.enum.Rarity}/${currentLayer.name}`,
              enabled: LayerSectionEnum.enum.Rarity === currentViewSection,
            },
            {
              name: LayerSectionEnum.enum.Rules,
              href: `/${organisationName}/${repositoryName}/${collectionName}/${LayerSectionEnum.enum.Rules}/${currentLayer.name}`,
              enabled: LayerSectionEnum.enum.Rules === currentViewSection,
            },
            // {
            //   name: LayerSectionEnum.enum.Settings,
            //   route: `${LayerSectionEnum.enum.Settings}`,
            // },
          ]}
        />
      </Layout.Header>
      <Layout.Title>
        <SectionHeader />
      </Layout.Title>
      <Layout.Body>
        <PageImplementation
          organisationName={organisationName}
          repositoryName={repositoryName}
          collectionName={collectionName}
          routes={routes}
        />
      </Layout.Body>
    </Layout>
  ) : (
    <Loading />
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const token = await getToken({ req: context.req })
  const address = token?.sub ?? null
  if (!address) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  console.log(session)

  return {
    props: {
      address,
      session,
    },
  }
}

export default Page
