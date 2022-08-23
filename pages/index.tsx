import { GetStaticProps } from 'next'
import React from 'react'

// note: this page hasnt been implemented yet
const Page = () => {
  return (
    <>
      <div>Nothing here.</div>
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
