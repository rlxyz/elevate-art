import { useCurrentLayer } from '@hooks/useCurrentLayer'
import useRepositoryStore from '@hooks/useRepositoryStore'

import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { RuleConditionDisplay } from './RuleConditionDisplay'
import { RuleConditionSelector } from './RuleConditionSelector'

const Index = () => {
  const { currentLayer, isLoading, isError, refetch } = useCurrentLayer()

  if (isLoading || !currentLayer) return <div>Loading...</div>
  if (isError) return <div>Error...</div>

  const { name, traitElements } = currentLayer

  return (
    <CollectionViewContent
      title={name}
      description='Set how often you want certain images to appear in the generation'
    >
      <div className='p-8 flex flex-col divide-y divide-lightGray space-y-6'>
        <RuleConditionSelector
          traitElements={traitElements}
          layerName={name}
          title='Create a condition'
          onSuccess={refetch}
        />
        <div className='pt-6'>
          <RuleConditionDisplay
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
