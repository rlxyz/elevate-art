import DomCompilerView from '@components/CollectionView/Index'
import { Layout } from '@components/Layout/Layout'
import { fetcher } from '@utils/fetcher'
import { Repository } from '@utils/types'
import React from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

const Page = ({ fallback }: { fallback: Repository }) => {
  return (
    <Layout>
      <SWRConfig value={{ fallback }}>
        <DomCompilerView />
      </SWRConfig>
    </Layout>
  )
}

export const getServerSideProps = async ({ params }) => {
  return {
    props: {
      fallback: {
        [unstable_serialize([params.organisation, params.repository])]:
          await fetcher(`${params.organisation}/${params.repository}`),
      },
    },
  }
}

export default Page
