import { Layout } from '@components/Layout/Layout'
import { Organisation, Repository } from '@utils/types'
import React, { useEffect, useState } from 'react'
import useSWR, { SWRConfig, unstable_serialize } from 'swr'
import { NextRouter, useRouter } from 'next/router'
import useRepositoryStore from '@hooks/useRepositoryStore'
import {
  LayerSectionEnum,
  LayerSectionEnumIndexes,
  LayerSectionEnumNames,
} from '@components/Repository/RepositoryImplementation'
import { fetcher } from '@utils/fetcher'
import { Index } from '@components/Repository/Index'

const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const routes: string = router.query.routes as string
  const [hasHydrated, setHasHydrated] = useState<boolean>(false)
  const { data } = useSWR<Organisation>(
    `organisation/${organisationName}`,
    fetcher
  )

  const {
    layers,
    organisation,
    currentLayer,
    setCurrentLayer,
    setCurrentLayerPriority,
    setCurrentViewSection,
    setOrganisation,
  } = useRepositoryStore((state) => {
    return {
      layers: state.layers,
      organisation: state.organisation,
      setOrganisation: state.setOrganisation,
      currentLayer: state.currentLayer,
      setCurrentLayer: state.setCurrentLayer,
      setCurrentLayerPriority: state.setCurrentLayerPriority,
      setCurrentViewSection: state.setCurrentViewSection,
    }
  })

  useEffect(() => {
    setCurrentViewSection(LayerSectionEnum.LAYERS)
  }, [])

  useEffect(() => {
    if (!layers || layers.length == 0 || !routes) {
      return
    }

    if (routes.length === 1 && routes[0] === LayerSectionEnumNames[0]) {
      setCurrentViewSection(0)
      setCurrentLayerPriority(0)
      setCurrentLayer(0)
      setHasHydrated(true)
      return
    }

    if (routes.length == 2) {
      const section = routes[0]
      const name = routes[1]
      const layer = layers.filter((layer) => layer.name === name)[0]

      if (!layer) {
        router.push('/404')
        return
      }

      setCurrentViewSection(LayerSectionEnumIndexes[section])
      setCurrentLayerPriority(layer.priority)
      setCurrentLayer(layer.priority)
      setHasHydrated(true)
      return
    }

    router.push('/404')
  }, [routes])

  useEffect(() => {
    console.log(currentLayer)
  }, [])

  useEffect(() => {
    data && setOrganisation(data)
  }, [data])

  return hasHydrated && <Index />
}

export default Page
