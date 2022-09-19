import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { RarityDisplay } from './RarityDisplay'

const Index = () => {
  const { currentLayer } = useCurrentLayer()
  const { name } = currentLayer
  return (
    <CollectionViewContent title={name} description='Set how often you want certain images to appear in the generation'>
      <RarityDisplay />
    </CollectionViewContent>
  )
}

export default Index
