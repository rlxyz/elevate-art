import React, { useEffect } from 'react'
import DomCompilerView from '@components/CollectionView/Index'
import { Repository } from '@utils/types'
import { SWRConfig, unstable_serialize } from 'swr'
import { fetcher } from '../../../utils/fetcher'
import { NextRouter, useRouter } from 'next/router'
import { Layout } from '@components/Layout/Layout'

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
