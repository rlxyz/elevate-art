import Loading from '@components/UI/Loading'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { TraitRulesDisplayAll } from './TraitRulesDisplayAll'
import { TraitRulesSelector } from './TraitRulesSelector'

const Index = () => {
  const { currentLayer, isLoading, isError } = useCurrentLayer()

  if (isLoading || !currentLayer) return <Loading />
  if (isError) return <div>Error...</div>

  const { name, traitElements } = currentLayer

  return (
    <CollectionViewContent title={name} description='Set how often you want certain images to appear in the generation'>
      <div className='flex flex-col divide-y divide-mediumGrey space-y-6'>
        <TraitRulesSelector traitElements={traitElements} title='Create a condition' />
        <div className='pt-8'>
          {traitElements.filter(
            (traitElement) => traitElement.rulesPrimary.length > 0 || traitElement.rulesSecondary.length > 0
          ).length ? (
            <TraitRulesDisplayAll traitElements={traitElements} title='Applied Rules' />
          ) : (
            <></>
          )}
        </div>
      </div>
    </CollectionViewContent>
  )
}

export default Index
