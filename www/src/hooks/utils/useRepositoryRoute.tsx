import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useCollectionNavigationStore from '@hooks/store/useCollectionNavigationStore'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const useRepositoryRoute = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const collectionName: string = (router.query.collection as string) || 'main'
  const repositoryName: string = router.query.repository as string
  const routes: string | string[] | undefined = router.query.routes
  const [mainRepositoryHref, setMainRepositoryHref] = useState<null | string>(null)
  const { all: layers } = useQueryRepositoryLayer()

  const { setCurrentLayerPriority, currentLayerPriority, setCurrentViewSection, currentViewSection } =
    useCollectionNavigationStore((state) => {
      return {
        currentLayerPriority: state.currentLayerPriority,
        currentViewSection: state.currentViewSection,
        setCurrentLayerPriority: state.setCurrentLayerPriority,
        setCurrentViewSection: state.setCurrentViewSection,
      }
    })

  // sync routing with store
  // useDeepCompareEffect(() => {
  //   if (!layers || layers.length === 0 || !routes) return
  //   const parse = CollectionNavigationEnum.safeParse(routes[0])
  //   if (!parse.success) {
  //     router.push('/404')
  //     return
  //   }

  //   if (routes.length === 1) {
  //     const route = parse.data
  //     switch (route) {
  //       case CollectionNavigationEnum.enum.Preview:
  //         setCurrentLayerPriority(layers[0]?.id || '')
  //         setCurrentViewSection(parse.data)
  //         return
  //       case CollectionNavigationEnum.enum.Settings:
  //         setCurrentLayerPriority(layers[0]?.id || '')
  //         setCurrentViewSection(parse.data)
  //         return
  //     }

  //     router.push('/404')
  //   }

  //   if (routes.length == 2) {
  //     const name: string = routes[1] as string
  //     const layer = layers.filter((layer) => layer.name === name)[0]

  //     if (!layer) {
  //       router.push('/404')
  //       return
  //     }

  //     setCurrentViewSection(parse.data)
  //     setCurrentLayerPriority(layers.find((x) => x.name === name)?.id || '')
  //     return
  //   }

  //   router.push('/404')
  // }, [routes, layers])

  useEffect(() => {
    if (Boolean(organisationName) && Boolean(repositoryName)) {
      setMainRepositoryHref(`${organisationName}/${repositoryName}`)
    }
  }, [organisationName, repositoryName])

  return {
    isLoading: mainRepositoryHref === null,
    mainRepositoryHref: mainRepositoryHref,
    collectionName,
  }
}
