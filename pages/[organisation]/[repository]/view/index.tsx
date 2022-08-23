import { Layout } from '@components/Layout/Layout'
import { Organisation, Repository } from '@utils/types'
import React, { useEffect } from 'react'
import useSWR, { SWRConfig, unstable_serialize } from 'swr'
import useCompilerViewStore, { useStore } from '@hooks/useCompilerViewStore'
import { fetcher } from '../../../../utils/fetcher'
import { NextRouter, useRouter } from 'next/router'
import { Index } from '../../../../components/Repository/Index'

const Page = ({ fallback }: { fallback: Repository }) => {
  const router: NextRouter = useRouter()
  const name: string = router.query.organisation as string
  const { data } = useSWR<Organisation>(`organisation/${name}`, fetcher, {
    refreshInterval: 3000,
  })
  // const state = useStore((state) => state.organisation)

  // useEffect(() => console.log(state), [])

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
        <Index />
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
