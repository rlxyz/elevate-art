import type { Prisma } from '@prisma/client'
import { Inngest } from 'inngest'
import { env } from 'src/env/server.mjs'

export type InngestEvents = {
  'repository-deployment/bundle-images': {
    name: 'repository-deployment/images.create'
    data: { repositoryId: string; deploymentId: string; attributes: Prisma.JsonArray }
  }
  'repository-contract-deployment/create-deployment': {
    name: 'repository-contract-deployment/contract.create'
    data: { repositoryId: string; deploymentId: string; contractAddress: string }
  }
}

export const createIngestInstance = () => {
  return new Inngest<InngestEvents>({
    name: env.NEXT_PUBLIC_APP_NAME,
    eventKey: env.INNGEST_EVENT_KEY,
  })
}
