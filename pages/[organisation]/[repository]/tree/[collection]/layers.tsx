import { Layout } from '@components/Layout/Layout'
import { Organisation, Repository } from '@utils/types'
import React, { useEffect, useState } from 'react'
import useSWR, { SWRConfig, unstable_serialize } from 'swr'
import { NextRouter, useRouter } from 'next/router'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { LayerSectionEnum } from '@components/Repository/RepositoryImplementation'
import { fetcher } from '@utils/fetcher'
import { Index } from '@components/Repository/Index'

const Page = () => {
  const router: NextRouter = useRouter()
  const name: string = router.query.organisation as string
  const [hasHydrated, setHasHydrated] = useState<boolean>(false)
  const { data } = useSWR<Organisation>(`organisation/${name}`, fetcher)

  const { organisation, setCurrentViewSection, setOrganisation } =
    useRepositoryStore((state) => {
      return {
        organisation: state.organisation,
        setOrganisation: state.setOrganisation,
        setCurrentViewSection: state.setCurrentViewSection,
      }
    })

  useEffect(() => {
    organisation && setHasHydrated(true)
  }, [organisation])

  useEffect(() => {
    setCurrentViewSection(LayerSectionEnum.IMAGES)
  }, [])

  // set organisation
  useEffect(() => {
    data && setOrganisation(data)
  }, [data])

  return <Layout>{hasHydrated && <Index />}</Layout>
}

export default Page
