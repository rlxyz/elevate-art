import BasicDomLayout from '@components/Dom/BasicDomLayout'
import DomIndex from '@components/Dom/DomIndex'
import { GetStaticProps } from 'next'
import React from 'react'

// note: this page hasnt been implemented yet
const Page = () => {
  return (
    <>
      <BasicDomLayout>
        <DomIndex />
      </BasicDomLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (_) => {
  return {
    props: {
      title: 'Index',
    },
  }
}

export default Page
