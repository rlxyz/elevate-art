import { Prisma } from '@prisma/client'
import { Inngest } from 'inngest'
import { env } from 'src/env/server.mjs'
import { Events } from '__generated__/inngest'

export const inngest = new Inngest<
  Events & {
    'repository-deployment/bundle-images': {
      name: 'repository-deployment/images.create'
      data: { repositoryId: string; deploymentId: string; attributes: Prisma.JsonArray }
    }
  }
>({
  name: env.NEXT_PUBLIC_APP_NAME,
  eventKey: env.INNGEST_EVENT_KEY,
})
