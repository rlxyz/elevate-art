import { Layout } from '@components/Layout/Layout'
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
import { CollectionNavigationEnum } from 'src/types/enums'
import { useRepositoryRoute } from '../../../hooks/utils/useRepositoryRoute'

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
  const { setCurrentLayerPriority, currentLayerPriority, setCurrentViewSection, currentViewSection } =
    useCollectionNavigationStore((state) => {
      return {
        currentLayerPriority: state.currentLayerPriority,
        currentViewSection: state.currentViewSection,
        setCurrentLayerPriority: state.setCurrentLayerPriority,
        setCurrentViewSection: state.setCurrentViewSection,
      }
    })
  const { collectionName } = useRepositoryRoute()
  const isLoading = isLoadingLayers && isLoadingCollection && isLoadingRepository && isRoutesLoading && isLoadingOrganisation

  useEffect(() => {
    setCurrentViewSection(CollectionNavigationEnum.enum.Rules)
  }, [])

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

  return (
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
              href: `/${mainRepositoryHref}`,
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
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rules}`,
              enabled: CollectionNavigationEnum.enum.Rules === currentViewSection,
            },
          ]}
        />
        <Layout.Body border='lower'>
          {layers && currentViewSection === CollectionNavigationEnum.enum.Rules && <RepositoryRuleCreateView />}
          {layers &&
          layers.flatMap((x) => x.traitElements).filter((x) => x.rulesPrimary.length || x.rulesSecondary.length).length &&
          currentViewSection === CollectionNavigationEnum.enum.Rules ? (
            <RepositoryRuleDisplayView />
          ) : null}
        </Layout.Body>
      </>
    </Layout>
  )
}

export default Page
