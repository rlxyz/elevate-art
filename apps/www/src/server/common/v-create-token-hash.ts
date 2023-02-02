import type { AssetDeployment, ContractDeployment } from '@prisma/client'
import { generateSeedBasedOnAssetDeploymentType } from '@server/common/v-get-token-seed'
import { sumBy } from '@utils/object-utils'
import * as v from 'src/shared/compiler'

export const getImageTokenFromAssetDeployment = async ({
  deployment,
  contractDeployment,
  layerElements,
  tokenId,
}: {
  deployment: AssetDeployment
  contractDeployment: ContractDeployment
  tokenId: number
  layerElements: v.Layer[]
}) => {
  // Seed
  const seedResponse = await generateSeedBasedOnAssetDeploymentType(deployment, contractDeployment, tokenId)
  if (seedResponse.failed) {
    return null
  }
  const vseed = seedResponse.getValue()

  const tokens = v.one(
    v.parseLayer(
      layerElements
        .filter((x) => x.traits.length > 0)
        .map((x) => ({
          ...x,
          traits: [
            ...x.traits,
            { id: `none-${x.id}`, weight: Math.max(0, 100 - sumBy(x.traits || 0, (x) => x.weight)), rules: [] } as v.Trait,
          ] as v.Trait[],
        }))
        .sort((a, b) => a.priority - b.priority)
    ),
    vseed
  )

  if (!tokens) {
    return null
  }

  // Get Trait Elements
  return {
    tokens: tokens.filter((x) => !x[1].startsWith('none-')),
    vseed,
  }
}
