import useCompilerViewStore from '@hooks/useCompilerViewStore'

import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { RuleConditionDisplay } from './RuleConditionDisplay'
import { RuleConditionSelector } from './RuleConditionSelector'

const CollectionRulesView = () => {
  const layers = useCompilerViewStore((state) => state.layers)
  const { currentLayer } = useCompilerViewStore((state) => {
    return {
      currentLayer: state.currentLayer,
    }
  })

  // useEffect(() => {
  //   console.log('change', currentLayer, currentLayer.traits)
  // }, [currentLayer])

  return (
    <CollectionViewContent
      title={'Custom Trait Rules'}
      description='Set how often you want certain images to appear in the generation'
    >
      <div className='p-8 flex flex-col divide-y divide-lightGray space-y-6'>
        <div>
          <RuleConditionSelector layers={layers} title='Create a condition' />
        </div>
        <div className='pt-6'>
          <RuleConditionDisplay
            title={currentLayer.name}
            condition='only mixes with'
            traits={currentLayer.traits} // todo: fix
            disabled={true}
          />
        </div>
        {/* <div className='pt-6'>
          <RuleConditionDisplay
            title='Arms'
            condition='only mixes with'
            traits={layers[0].traits.filter((_) => Math.random() > 0.5)} // todo: fix
            disabled={true}
          />
        </div> */}
      </div>
    </CollectionViewContent>
  )
}

export default CollectionRulesView
