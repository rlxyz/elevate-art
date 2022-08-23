import RepositoryImplementation from '@components/Repository/RepositoryImplementation'
import { Repository } from '@utils/types'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { fetcher } from '../../utils/fetcher'
import { NextRouter, useRouter } from 'next/router'
import { useKeybordShortcuts } from '@hooks/useKeyboardShortcuts'
import { createArtCollection } from '@utils/x/Collection'

export const Index = () => {
  useKeybordShortcuts()
  const router: NextRouter = useRouter()
  const name: string = router.query.repository as string
  const {
    artCollection,
    organisation,
    collection,
    repository,
    setCollection,
    setArtCollection,
    setLayers,
    setRepository,
  } = useRepositoryStore((state) => {
    return {
      artCollection: state.artCollection,
      organisation: state.organisation,
      collection: state.collection,
      repository: state.repository,
      setLayers: state.setLayers,
      setArtCollection: state.setArtCollection,
      setCollection: state.setCollection,
      setRepository: state.setRepository,
    }
  })

  const { data } = useSWR<Repository>(`repository/${name}`, fetcher)

  // set repository
  useEffect(() => {
    data && setRepository(data)
  }, [data])

  // set collection
  useEffect(() => {
    if (!repository || !repository.collections) return

    // init
    const { layers, collections, name } = repository
    const collection = collections[0]
    // const { id, generations, totalSupply } = collection

    // create app
    setCollection(collection)
    setLayers(layers)
    // setArtCollection(createArtCollection(name, id, generations, 0, totalSupply))
  }, [repository])

  return (
    organisation && repository && collection && <RepositoryImplementation />
  )
}
