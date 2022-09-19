import useOrganisationNavigationStore from '@hooks/useOrganisationNavigationStore'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'
import ViewAllCollections from '../Collection/CollectionHelpers/CollectionBranchSelector'

const Index = () => {
  const setCurrentRoute = useOrganisationNavigationStore((state) => state.setCurrentRoute)
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.Dashboard)
  }, [])
  return <ViewAllCollections />
}

export default Index
