import dynamic from 'next/dynamic'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'
import { Layout } from '@components/Layout/Layout'
import FileUpload from '@components/CloudinaryImage/FileUpload'
import { NextRouter, useRouter } from 'next/router'

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

export const getStaticPaths: GetStaticPaths = async (context) => {
  return {
    paths: ['/[organisation]/[repository]/upload'],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      title: 'Upload',
    },
  }
}

export default Page
