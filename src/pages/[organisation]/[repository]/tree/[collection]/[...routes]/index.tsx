import React, { useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { LayerSectionEnum } from 'src/types/enums'
import Index from '@components/Repository/Index'
import { trpc } from '@utils/trpc'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import { useKeybordShortcuts } from '@hooks/useKeyboardShortcuts'
import Loading from '@components/UI/Loading'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { Layout } from '@components/Layout/Layout'

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
  const { data: organisationData } = trpc.useQuery([
    'organisation.getOrganisationByName',
    { name: organisationName },
  ])
  const { data: repositoryData } = trpc.useQuery([
    'repository.getRepositoryByName',
    { name: repositoryName },
  ])
  // const { data: collectionData } = trpc.useQuery([
  //   'collection.getCollectionByRepositoryId',
  //   { repositoryId: repositoryData?.id },
  // ])

  const { layers, setOrganisation, repository, setCollection, setLayers, setRepository } =
    useRepositoryStore((state) => {
      return {
        layers: state.layers,
        organisation: state.organisation,
        setOrganisation: state.setOrganisation,
        collection: state.collection,
        repository: state.repository,
        setLayers: state.setLayers,
        setCollection: state.setCollection,
        setRepository: state.setRepository,
      }
    })

  const { setCurrentLayerPriority, setCurrentViewSection } = useRepositoryRouterStore((state) => {
    return {
      setCurrentLayerPriority: state.setCurrentLayerPriority,
      setCurrentViewSection: state.setCurrentViewSection,
    }
  })

  // sync routing with store
  useEffect(() => {
    if (!layers || layers.length === 0 || !routes) return

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
          setCurrentLayerPriority(0)
          return
        case LayerSectionEnum.enum.Settings:
          setCurrentViewSection(parse.data)
          setCurrentLayerPriority(4)
          return
      }
    }

    if (routes.length == 2) {
      const name: string = routes[1] as string
      const layer = layers.filter((layer) => layer.name === name)[0]

      if (!layer) {
        router.push('/404')
        return
      }

      setCurrentViewSection(parse.data)
      setCurrentLayerPriority(layer.priority)
      return
    }

    router.push('/404')
  }, [routes])

  // sync org to store
  useEffect(() => {
    if (!organisationData) return

    setOrganisation(organisationData)
  }, [organisationData])

  // sync repository to store
  useEffect(() => {
    if (!repositoryData) return
    if (!repositoryData.collections) return

    const layers = repositoryData.layers
    const collection = repositoryData.collections[0]

    if (!collection) return
    if (!layers || layers.length == 0) return

    setRepository(repository)
    setCollection(collection)
    setLayers(layers)
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

  useEffect(() => {
    setHasHydrated(Boolean(organisationName) && Boolean(repositoryName))
  }, [organisationName, repositoryName])

  return hasHydrated ? (
    <Layout>
      <PageImplementation
        organisationName={organisationName}
        repositoryName={repositoryName}
        collectionName={collectionName}
        routes={routes}
      />
    </Layout>
  ) : (
    <Loading />
  )
}

export default Page
