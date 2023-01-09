import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { generateSeedBasedOnAssetDeploymentType } from '@server/common/v-get-token-seed'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDeploymentTokenImage } from 'src/client/utils/image'
import * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  if (!session || !session.user) {
    return res.status(401).send('Unauthorized')
  }

  // o: organisationName, r: repositoryName, seed, id
  const { o: organisationName, r: repositoryName, seed, id } = req.query as { o: string; r: string; seed: string; id: string }
  if (!organisationName || !repositoryName || !seed || !id) {
    return res.status(400).send('Bad Request')
  }

  // get the repository with repositoryId's layerElement, traitElements & rules with prisma
  //! only users who are members of the organisation can access the image through stealth mode
  const deployment = await prisma?.assetDeployment.findFirst({
    where: {
      branch: AssetDeploymentBranch.PREVIEW,
      repository: {
        name: repositoryName,
        organisation: {
          name: organisationName,
          members: {
            some: { userId: session.user.id },
          },
        },
      },
      name: seed,
    },
    include: { repository: true, contractDeployment: true },
  })

  if (!deployment) {
    return res.status(404).send('Not Found')
  }

  if (!deployment.contractDeployment) {
    return res.status(404).send('Not Found')
  }

  if (deployment.totalSupply <= parseInt(id)) {
    return res.status(400).send('Bad Request')
  }

  const layerElements = deployment.layerElements as Prisma.JsonArray as v.Layer[]

  const seedResponse = await generateSeedBasedOnAssetDeploymentType(deployment, deployment.contractDeployment, parseInt(id))
  if (seedResponse.failed) {
    return res.status(404).send('Not Found')
  }

  const vseed = seedResponse.getValue()
  const tokens = v.one(v.parseLayer(layerElements), vseed)

  const response = {
    name: `${deployment.repository.tokenName || ''} #${id}`,
    description: deployment.repository.description,
    tokenHash: vseed,
    image: getDeploymentTokenImage({
      o: organisationName,
      r: repositoryName,
      tokenId: id,
      d: deployment.name,
      branch: deployment.branch,
    }),
    attributes: tokens.reverse().map(([l, t]) => {
      const layerElement = layerElements.find((x) => x.id === l)
      if (!layerElement) return
      const traitElement = layerElement.traits.find((x) => x.id === t)
      if (!traitElement) return

      return {
        trait_type: layerElement.name,
        value: traitElement.name,
      }
    }),
    logoImage: deployment.repository.logoImageUrl,
    bannerImage: deployment.repository.bannerImageUrl,
    artist: 'Jacob Riglin <https://twitter.com/jacobriglin>',
    license: 'CC BY-NC 4.0',
    script: 'js',
    external_url: 'https://journey.dreamlab.art',
  }

  return res
    .setHeader('Content-Type', 'application/json')
    .send(JSON.stringify(Object.fromEntries(Object.entries(response).filter(([_, v]) => v != null)), null, 2))
}

export default index
