import Loading from '@components/UI/Loading'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import RuleDisplayAll from './RuleDisplayAll'
import RuleSelector from './RuleSelector'

const Index = () => {
  const { currentLayer, isLoading, isError } = useCurrentLayer()

  if (isLoading || !currentLayer) return <Loading />
  if (isError) return <div>Error...</div>

  const { name } = currentLayer

  return (
    <CollectionViewContent title={name} description='Set how often you want certain images to appear in the generation'>
      <div className='flex flex-col divide-y divide-mediumGrey space-y-6'>
        <RuleSelector />
        <div className='py-8'>
          <RuleDisplayAll />
        </div>
      </div>
    </CollectionViewContent>
  )
}

export default Index
