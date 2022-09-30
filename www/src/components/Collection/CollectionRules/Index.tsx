import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import RuleDisplayAll from './RuleDisplayAll'
import RuleSelector from './RuleSelector'

export const RuleSelectorContainer = () => {
  const { all: layers, isLoading } = useQueryRepositoryLayer()
  if (isLoading || !layers) return <></>
  return (
    <div className='w-full py-16'>
      <div className='flex justify-center'>
        <div className='space-y-1 w-full'>
          <span className='text-xs font-semibold uppercase'>Create a condition</span>
          <RuleSelector layers={layers} />
        </div>
      </div>
    </div>
  )
}

export const RuleDisplayContainer = () => {
  const { all: layers, isLoading } = useQueryRepositoryLayer()
  if (isLoading || !layers) return <></>
  return (
    <div className='w-full py-16'>
      <div className='space-y-3 w-full flex flex-col justify-center'>
        <span className='text-xs font-semibold uppercase'>All rules created</span>
        <RuleDisplayAll traitElements={layers.flatMap((x) => x.traitElements)} />
      </div>
    </div>
  )
}
