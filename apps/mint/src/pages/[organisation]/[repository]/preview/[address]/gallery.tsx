import { Gallery } from '@Components/Gallery'
import { AssetDeploymentBranch } from '@prisma/client'
import type { GetServerSidePropsContext, NextPage } from 'next'

export const Page: NextPage = () => <Gallery type={AssetDeploymentBranch.PREVIEW} />

/**
 * If user is authenticated, redirect the user to his contract deployment.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { address } = context.query as { [key: string]: string }
  // const session = await unstable_getServerSession(context.req, context.res, authOptions)
  // if (!address || !session?.user) {
  //   return {
  //     redirect: {
  //       destination: `/404`,
  //       permanant: false,
  //     },
  //   }
  // }

  // const valid = await prisma.contractDeployment.findFirst({
  //   where: {
  //     address,
  //     repository: {
  //       organisation: {
  //         members: {
  //           some: {
  //             user: {
  //               id: session.user.id,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // })

  // if (!valid) {
  //   return {
  //     redirect: {
  //       destination: `/404`,
  //       permanant: false,
  //     },
  //   }
  // }

  // return {
  //   props: {},
  // }
}

export default Page
