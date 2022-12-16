import { Mint } from '@Components/Mint'
import { AssetDeploymentBranch } from '@prisma/client'
import type { GetServerSidePropsContext, NextPage } from 'next'

export const Page: NextPage = () => <Mint type={AssetDeploymentBranch.PREVIEW} />

/**
 * If user is authenticated, redirect the user to his contract deployment.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { address } = context.query as { [key: string]: string }
  // const session = await getSession(context)
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
