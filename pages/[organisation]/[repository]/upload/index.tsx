import FileUpload from '@components/CloudinaryImage/FileUpload'
import { Layout } from '@components/Layout/Layout'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextRouter, useRouter } from 'next/router'
import React from 'react'

const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string

  return (
    organisationName &&
    repositoryName && (
      <>
        <Layout>
          <div className='min-h-screen w-screen mx-auto h-[40%]'>
            <FileUpload id={`${organisationName}/${repositoryName}`}>
              <div className='h-1/2'>Upload here.</div>
            </FileUpload>
          </div>
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
