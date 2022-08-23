import DomCompilerView from '@components/Repository/RepositoryView'
import { Repository } from '@utils/types'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import useRepositoryStore from '@hooks/useCompilerViewStore'
import { fetcher } from '../../utils/fetcher'
import { NextRouter, useRouter } from 'next/router'
import { useKeybordShortcuts } from '@hooks/useKeyboardShortcuts'
import { createArtCollection } from '@utils/x/Collection'

export const Index = () => {
  useKeybordShortcuts()
  const router: NextRouter = useRouter()
  const name: string = router.query.repository as string
  const {
    organisation,
    collection,
    repository,
    setCollection,
    setArtCollection,
    setCurrentLayer,
    setLayers,
    setRepository,
  } = useRepositoryStore((state) => {
    return {
      organisation: state.organisation,
      collection: state.collection,
      repository: state.repository,
      setCurrentLayer: state.setCurrentLayer,
      setLayers: state.setLayers,
      setArtCollection: state.setArtCollection,
      setCollection: state.setCollection,
      setRepository: state.setRepository,
    }
  })

  const { data } = useSWR<Repository>(`repository/${name}`, fetcher, {
    refreshInterval: 300,
  })

  // set repository
  useEffect(() => {
    data && setRepository(data)
  }, [data])

  // set collection
  useEffect(() => {
    if (!repository || !repository.collections) return
    console.log(repository)
    // init
    const { layers, collections, name } = repository
    const collection = collections[0]
    const { id, generations, totalSupply } = collection

    // create app
    setCollection(collection)
    setLayers(layers)
    setCurrentLayer(0)

    setArtCollection(createArtCollection(name, id, generations, 0, totalSupply))
  }, [repository])

  return organisation && repository && collection && <DomCompilerView />
}
