import { Layout } from '@components/Layout/Layout'
import { RepositoryContext } from '@hooks/useCompilerViewStore'
import { GetStaticPaths, GetStaticProps } from 'next'
import React, { useEffect } from 'react'

const Page = () => {
  const { organisation } = RepositoryContext.useStore((state) => {
    return {
      organisation: state.organisation,
    }
  })

  return (
    organisation && (
      <>
        <Layout>
          <main className='min-h-screen w-screen mx-auto h-[40%]'>
            <div>{organisation.name}</div>
          </main>
        </Layout>
      </>
    )
  )
}

export const getStaticPaths: GetStaticPaths = async (_) => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (_) => {
  return {
    props: {
      title: 'Upload',
    },
  }
}

export default Page
