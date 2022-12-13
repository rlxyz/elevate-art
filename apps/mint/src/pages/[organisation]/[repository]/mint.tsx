import { Mint } from '@Components/Mint'
import { AssetDeploymentBranch } from '@prisma/client'
import type { NextPage } from 'next'

export const Page: NextPage = () => <Mint type={AssetDeploymentBranch.PRODUCTION} />
