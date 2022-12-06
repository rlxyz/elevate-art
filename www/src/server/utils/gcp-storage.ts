import { Storage } from '@google-cloud/storage'
import { env } from 'src/env/server.mjs'

export const storage = new Storage({
  projectId: env.GCP_PROJECT_ID,
  credentials: {
    client_email: env.GCP_CLIENT_EMAIL,
    private_key: env.GCP_PRIVATE_KEY,
  },
})
