import { Layout } from '@components/Layout/Layout'
import { Organisation, Repository } from '@utils/types'
import React, { useEffect, useState } from 'react'
import useSWR, { SWRConfig, unstable_serialize } from 'swr'
import { fetcher } from '../../../../utils/fetcher'
import { NextRouter, useRouter } from 'next/router'
import { Index } from '../../../../components/Repository/Index'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { LayerSectionEnum } from '@components/Repository/RepositoryImplementation'

const Page = ({ fallback }: { fallback: Repository }) => {
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
    setCurrentViewSection(LayerSectionEnum.RARITY)
  }, [])

  // set organisation
  useEffect(() => {
    data && setOrganisation(data)
  }, [data])

  return (
    hasHydrated && (
      <Layout>
        <SWRConfig value={{ fallback }}>
          <Index />
        </SWRConfig>
      </Layout>
    )
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
