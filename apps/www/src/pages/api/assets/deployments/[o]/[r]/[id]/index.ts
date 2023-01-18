import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { generateSeedBasedOnAssetDeploymentType } from '@server/common/v-get-token-seed'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getBannerForRepository, getDeploymentTokenImage, getLogoForRepository } from 'src/client/utils/image'
import * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  // o: organisationName, r: repositoryName, seed, id
  const { o: organisationName, r: repositoryName, id } = req.query as { o: string; r: string; id: string }
  if (!organisationName || !repositoryName || !id) {
    return res.status(400).send('Bad Request')
  }

  // get the repository with repositoryId's layerElement, traitElements & rules with prisma
  //! only users who are members of the organisation can access the image through stealth mode
  const deployment = await prisma?.assetDeployment.findFirst({
    where: {
      branch: AssetDeploymentBranch.PRODUCTION,
      repository: {
        name: repositoryName,
        organisation: {
          name: organisationName,
        },
      },
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
    name: [deployment.repository.tokenName || '', `#${id}`].join(' '),
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
    logoImage: getBannerForRepository({ r: deployment.repository.id }),
    bannerImage: getLogoForRepository({ r: deployment.repository.id }),
    artist: deployment.repository.artist,
    license: deployment.repository.license,
    external_url: deployment.repository.externalUrl,
  }

  return res
    .setHeader('Content-Type', 'application/json')
    .send(JSON.stringify(Object.fromEntries(Object.entries(response).filter(([_, v]) => v != null)), null, 2))
}

export default index
