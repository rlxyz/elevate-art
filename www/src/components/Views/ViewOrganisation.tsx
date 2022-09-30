import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'
import ViewAllRepositories from './ViewAllRepositories'

const Index = () => {
  const setCurrentRoute = useOrganisationNavigationStore((state) => state.setCurrentRoute)
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.Dashboard)
  }, [])
  return <ViewAllRepositories />
}

export default Index
