import { LayerElement } from '@prisma/client'
import { calculateTraitRarityFromQuantity } from '@utils/math'

import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import * as z from 'zod'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { RarityDisplay } from './RarityDisplay'
import { useNotification } from '@hooks/useNotification'

const Index = () => {
  const { currentLayer, refetch } = useCurrentLayer()
  const { id, name, traitElements } = currentLayer
  return (
    <CollectionViewContent
      title={name}
      description='Set how often you want certain images to appear in the generation'
    >
      <RarityDisplay layerName={name} layerId={id} traitElements={traitElements} />
    </CollectionViewContent>
  )
}

export default Index
