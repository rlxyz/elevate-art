import { Layout } from '@components/Layout/Layout'
import { Organisation, Repository } from '@utils/types'
import React, { useEffect } from 'react'
import useSWR, { SWRConfig, unstable_serialize } from 'swr'
import { fetcher } from '../../../../utils/fetcher'
import { NextRouter, useRouter } from 'next/router'
import { Index } from '../../../../components/Repository/Index'
import useRepositoryStore from '@hooks/useCompilerViewStore'

const PageImplementation = () => {
  const router: NextRouter = useRouter()
  const name: string = router.query.organisation as string
  const { data } = useSWR<Organisation>(`organisation/${name}`, fetcher)

  const { setOrganisation } = useRepositoryStore((state) => {
    return {
      setOrganisation: state.setOrganisation,
    }
  })

  // set organisation
  useEffect(() => {
    data && setOrganisation(data)
  }, [data])

  return <Index />
}

const Page = ({ fallback }: { fallback: Repository }) => {
  return (
    <Layout>
      <SWRConfig value={{ fallback }}>
        <PageImplementation />
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
        [unstable_serialize(['organisation', params.organisation])]:
          await fetcher(`organisation/${params.organisation}`),
      },
    },
  }
}

export default Page
