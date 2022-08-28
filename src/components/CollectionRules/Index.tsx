import Loading from '@components/UI/Loading'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { TraitRulesDisplayAll } from './TraitRulesDisplayAll'
import { TraitRulesSelector } from './TraitRulesSelector'

const Index = () => {
  const { currentLayer, isLoading, isError, refetch } = useCurrentLayer()

  if (isLoading || !currentLayer) return <Loading />
  if (isError) return <div>Error...</div>

  const { name, traitElements, id } = currentLayer

  return (
    <CollectionViewContent
      title={name}
      description='Set how often you want certain images to appear in the generation'
    >
      <div className='p-8 flex flex-col divide-y divide-lightGray space-y-6'>
        <TraitRulesSelector
          traitElements={traitElements}
          layerId={id}
          layerName={name}
          title='Create a condition'
          onSuccess={refetch}
        />
        <div className='pt-6'>
          <TraitRulesDisplayAll
            traitElements={traitElements}
            title='Applied Rules'
            onSuccess={refetch}
          />
        </div>
      </div>
    </CollectionViewContent>
  )
}

export default Index
