import { TrashIcon } from '@heroicons/react/outline'
import { Rules, useQueryLayerElementFindAll } from '@hooks/router/layerElement/useQueryLayerElementFindAll'
import { useState } from 'react'
import { RulesComboboxInput } from './RulesComboboxInput'
import { RulesDeleteModal } from './RulesDeleteModal'

export const RulesDisplayOneItem = ({ rule }: { rule: Rules }) => {
  const { primaryTraitElementId, secondaryTraitElementId, condition } = rule
  const { all: layers } = useQueryLayerElementFindAll() // @todo remove this
  const [isOpen, setIsOpen] = useState(false)
  const allTraitElements = layers.flatMap((x) => x.traitElements)
  const primary = allTraitElements.find((x) => x.id === primaryTraitElementId)
  const secondary = allTraitElements.find((x) => x.id === secondaryTraitElementId)
  if (typeof primary === 'undefined' || typeof secondary === 'undefined') return null
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
        <button className='w-full flex bg-white disabled:bg-white disabled:text-mediumGrey justify-center' onClick={() => setIsOpen(true)}>
          <TrashIcon className='w-4 h-4 text-mediumGrey' />
        </button>
        <RulesDeleteModal visible={isOpen} onClose={() => setIsOpen(false)} rule={rule} />
      </div>
    </div>
  )
}
