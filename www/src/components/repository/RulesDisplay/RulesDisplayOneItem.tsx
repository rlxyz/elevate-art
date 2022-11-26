import { TrashIcon } from '@heroicons/react/outline'
import { useMutateRepositoryDeleteRule } from '@hooks/mutations/useMutateRepositoryDeleteRule'
import { TraitElementWithRules } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { RulesType } from '@utils/compiler'
import { trpc } from '@utils/trpc'
import { RulesComboboxInput } from './RulesComboboxInput'

export const RulesDisplayOneItem = ({
  id,
  traitElements,
  condition,
}: {
  id: string
  traitElements: [TraitElementWithRules, TraitElementWithRules]
  condition: RulesType
}) => {
  const [primary, secondary] = traitElements
  const { mutate: deleteRule } = useMutateRepositoryDeleteRule()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { data: layers } = trpc.useQuery(['layers.getAll', { id: repositoryId }])
  const primaryLayer = layers?.find((l) => l.traitElements.find((t) => t.id === primary.id))
  const secondaryLayer = layers?.find((l) => l.traitElements.find((t) => t.id === secondary.id))
  return (
    <div className='grid grid-cols-10 space-x-3 text-darkGrey'>
      <div className='col-span-3 h-full relative'>
        <RulesComboboxInput traitElement={primary} layerName={primaryLayer?.name || ''} highlight={false} />
      </div>
      <div className='col-span-2 h-full relative'>
        <div className='w-full h-full rounded-[5px] overflow-hidden border border-mediumGrey bg-hue-light py-2 pl-3 text-xs'>
          {condition}
        </div>
      </div>
      <div className='col-span-4 h-full relative'>
        <RulesComboboxInput traitElement={secondary} layerName={secondaryLayer?.name || ''} highlight={false} />
      </div>
      <div className='col-span-1 h-full relative flex items-center right-0 justify-center'>
        <button
          className='w-full flex bg-white disabled:bg-white disabled:text-mediumGrey justify-center'
          onClick={() => {
            deleteRule({
              id,
              condition: condition,
              primaryLayerElementId: primary.layerElementId,
              secondaryLayerElementId: secondary.layerElementId,
              primaryTraitElementId: primary.id,
              secondaryTraitElementId: secondary.id,
            })
          }}
        >
          <TrashIcon className='w-4 h-4 text-mediumGrey' />
        </button>
      </div>
    </div>
  )
}
