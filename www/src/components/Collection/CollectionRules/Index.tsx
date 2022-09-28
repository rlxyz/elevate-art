import { useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import RuleDisplayAll from './RuleDisplayAll'
import RuleSelector from './RuleSelector'

export const RuleSelectorContainer = () => {
  return (
    <div className='w-full py-16'>
      <div className='flex justify-center'>
        <div className='space-y-1 w-full -translate-y-2'>
          <span className='text-xs font-semibold uppercase'>Create a condition</span>
          <RuleSelector />
        </div>
      </div>
    </div>
  )
}

export const RuleDisplayContainer = () => {
  const { data: layers } = useQueryRepositoryLayer()
  return (
    <div className='w-full py-16'>
      <div className='space-y-3 w-full flex flex-col justify-center'>
        <span className='text-xs font-semibold uppercase'>All rules created</span>
        {layers && <RuleDisplayAll traitElements={layers.flatMap((x) => x.traitElements)} />}
      </div>
    </div>
  )
}
