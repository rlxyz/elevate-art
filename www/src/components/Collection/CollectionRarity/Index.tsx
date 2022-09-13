import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { RarityDisplay } from './RarityDisplay'

const Index = () => {
  const { currentLayer, refetch } = useCurrentLayer()
  const { id, name, traitElements } = currentLayer
  return (
    <CollectionViewContent title={name} description='Set how often you want certain images to appear in the generation'>
      <RarityDisplay layerId={id} traitElements={traitElements} />
    </CollectionViewContent>
  )
}

export default Index
