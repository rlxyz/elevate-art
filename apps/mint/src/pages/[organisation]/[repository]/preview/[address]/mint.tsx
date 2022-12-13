import { Mint } from '@Components/Mint'
import { AssetDeploymentBranch } from '@prisma/client'
import type { GetServerSidePropsContext, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { env } from 'src/env/client.mjs'

export const Page: NextPage = () => <Mint type={AssetDeploymentBranch.PREVIEW} />

/**
 * If user is authenticated, redirect the user to his contract deployment.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { address } = context.query as { [key: string]: string }
  const session = await getSession(context)
  if (!address || !session?.user) {
    return {
      redirect: {
        destination: `${env.NEXT_PUBLIC_COMPILER_CLIENT_URL}`,
        permanant: false,
      },
    }
  }

  const valid = await prisma?.contractDeployment.findFirst({
    where: {
      address,
      repository: {
        organisation: {
          members: {
            some: {
              user: {
                id: session.user.id,
              },
            },
          },
        },
      },
    },
  })

  if (!valid) {
    return {
      redirect: {
        destination: `${env.NEXT_PUBLIC_COMPILER_CLIENT_URL}`,
        permanant: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default Page
