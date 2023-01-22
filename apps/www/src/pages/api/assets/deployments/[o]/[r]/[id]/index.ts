import type { Prisma } from '@prisma/client'
import { getAssetDeploymentByProduction } from '@server/common/db-get-asset-deployment-by-production-branch'
import { getImageTokenFromAssetDeployment } from '@server/common/v-create-token-hash'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getBannerForRepository, getDeploymentTokenImage, getLogoForRepository } from 'src/client/utils/image'
import type * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  /** Inputs */
  const { o: organisationName, r: repositoryName, id } = req.query as { o: string; r: string; id: string }
  if (!organisationName || !repositoryName || !id) {
    return res.status(400).send('Bad Request')
  }

  /** Validate Deployment */
  const deployment = await getAssetDeploymentByProduction({ organisationName, repositoryName })
  if (!deployment) {
    return res.status(404).send('Not Found')
  }

  if (!deployment.contractDeployment) {
    return res.status(404).send('Not Found')
  }

  if (deployment.totalSupply <= parseInt(id)) {
    return res.status(400).send('Bad Request')
  }

  /** Grab tokens */
  const { contractDeployment, layerElements } = deployment
  const elements = layerElements as Prisma.JsonValue as v.Layer[]
  const response = await getImageTokenFromAssetDeployment({
    deployment,
    contractDeployment,
    layerElements: elements,
    tokenId: parseInt(id),
  })
  if (!response) return res.status(500).send('Internal Server Error')

  const { tokens, vseed } = response
  const metadata = {
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
    attributes: tokens.map(([l, t]) => {
      const layerElement = elements.find((x) => x.id === l)
      if (!layerElement) return
      const traitElement = layerElement.traits.find((x) => x.id === t)
      if (!traitElement) return
      return { trait_type: layerElement.name, value: traitElement.name }
    }),
    logoImage: getBannerForRepository({ r: deployment.repository.id }),
    bannerImage: getLogoForRepository({ r: deployment.repository.id }),
    artist: deployment.repository.artist,
    license: deployment.repository.license,
    external_url: deployment.repository.externalUrl,
  }

  return res
    .setHeader('Content-Type', 'application/json')
    .send(JSON.stringify(Object.fromEntries(Object.entries(metadata).filter(([_, v]) => v != null)), null, 2))
}

export default index
