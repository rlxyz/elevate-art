import FileUpload from '@components/CloudinaryImage/FileUpload'
import { CollectionUpload } from '@components/CollectionView/CollectionUpload'
import { Layout } from '@components/Layout/Layout'
import { Button } from '@components/UI/Button'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextRouter, useRouter } from 'next/router'
import React, { useState } from 'react'

const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [open, setOpen] = useState(true)

  return (
    organisationName &&
    repositoryName && (
      <>
        <Layout>
          <div className='min-h-screen w-screen mx-auto h-[40%]'>
            <CollectionUpload open={open} setOpen={setOpen} />
            <Button onClick={() => setOpen(true)}>Open Upload Modal</Button>
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
    paths: ['/[organisation]/[repository]/upload'],
    fallback: 'blocking',
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
