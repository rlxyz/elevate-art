import { Gallery } from '@Components/Gallery'
import { AssetDeploymentBranch } from '@prisma/client'
import type { NextPage } from 'next'

export const Page: NextPage = () => <Gallery type={AssetDeploymentBranch.PRODUCTION} />

export default Page
