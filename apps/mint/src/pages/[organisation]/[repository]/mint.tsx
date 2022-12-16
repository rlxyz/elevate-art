import { Mint } from '@Components/Mint'
import { AssetDeploymentBranch } from '@prisma/client'
import type { NextPage } from 'next'

const Page: NextPage = () => <Mint type={AssetDeploymentBranch.PRODUCTION} />

export default Page
