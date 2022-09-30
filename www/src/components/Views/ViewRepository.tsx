import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'
import ViewAllCollections from '../Repository/CollectionHelpers/CollectionBranchSelector'

const Index = () => {
  const setCurrentRoute = useOrganisationNavigationStore((state) => state.setCurrentRoute)
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.Dashboard)
  }, [])
  return <ViewAllCollections />
}

export default Index
