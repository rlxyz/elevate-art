import DomCompilerView from '@components/CollectionView/Index'
import { Layout } from '@components/Layout/Layout'
import { Organisation, Repository } from '@utils/types'
import React, { useEffect } from 'react'
import useSWR, { SWRConfig, unstable_serialize } from 'swr'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { fetcher } from '../../../../utils/fetcher'
import { NextRouter, useRouter } from 'next/router'
import { useKeybordShortcuts } from '@hooks/useKeyboardShortcuts'
import { createArtCollection } from '@utils/x/Collection'

const RepositoryImplementation = () => {
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
  } = useCompilerViewStore((state) => {
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

    // init
    const { collections, name } = repository
    const collection = collections[0]
    const { id, generations, totalSupply } = collection

    // create app
    setCollection(collection)
    setArtCollection(createArtCollection(name, id, generations, 0, totalSupply))
    setLayers(data.layers)
    setCurrentLayer(0)
  }, [repository])

  return organisation && repository && collection && <DomCompilerView />
}

const Page = ({ fallback }: { fallback: Repository }) => {
  const router: NextRouter = useRouter()
  const name: string = router.query.organisation as string
  const { data } = useSWR<Organisation>(`organisation/${name}`, fetcher, {
    refreshInterval: 3000,
  })

  const { setOrganisation } = useCompilerViewStore((state) => {
    return {
      setOrganisation: state.setOrganisation,
    }
  })

  // set organisation
  useEffect(() => {
    data && setOrganisation(data)
  }, [data])

  return (
    <Layout>
      <SWRConfig value={{ fallback }}>
        <RepositoryImplementation />
      </SWRConfig>
    </Layout>
  )
}

export const getServerSideProps = async ({ params }) => {
  return {
    props: {
      fallback: {
        [unstable_serialize(['repository', params.repository])]: await fetcher(
          `repository/${params.repository}`
        ),
      },
    },
  }
}

export default Page
