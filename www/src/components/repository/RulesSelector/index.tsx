import { LayerElementWithRules, TraitElementWithRules } from '@hooks/query/useQueryRepositoryLayer'
import { RulesType } from '@utils/compiler'
import { useState } from 'react'
import { RulesCreateModal } from './RulesCreateModal'
import { RulesSelectConditionCombobox } from './RulesSelectConditionCombobox'
import { RulesSelectTraitElementCombobox } from './RulesSelectTraitElementCombobox'

export const TraitElementRulesSelector = ({ layers }: { layers: LayerElementWithRules[] | undefined }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCondition, setSelectedCondition] = useState<null | RulesType>(null)
  const [selectedLeftTrait, setSelectedLeftTrait] = useState<null | TraitElementWithRules>(null)
  const [selectedRightTrait, setSelectedRightTrait] = useState<null | TraitElementWithRules>(null)

  // note: this will transform all rules in the selected trait to a standard format and return the trait ids that are already selected
  const allInvalidRightTraitElements = [...(selectedLeftTrait?.rulesPrimary || []), ...(selectedLeftTrait?.rulesSecondary || [])]
    .map((rule) => {
      if (selectedLeftTrait?.id === rule.primaryTraitElementId) {
        return {
          condition: rule.condition,
          from: rule.primaryTraitElementId,
          with: rule.secondaryTraitElementId,
        }
      } else {
        return {
          condition: rule.condition,
          from: rule.secondaryTraitElementId,
          with: rule.primaryTraitElementId,
        }
      }
    })
    .filter((rule) => {
      if (!selectedCondition) return true
      return rule.condition === selectedCondition
    })
    .map((rule) => rule.with)

  const allRightTraitElements = layers
    ?.filter((layer) => !selectedLeftTrait || (selectedLeftTrait && layer.id !== selectedLeftTrait.layerElementId))
    .flatMap((layer) => layer.traitElements)
    .filter((trait) => {
      if (!selectedLeftTrait) return true
      return !allInvalidRightTraitElements.includes(trait.id)
    })

  return (
    <div className='w-full flex flex-col space-y-3'>
      <div className='grid grid-cols-10 space-x-3'>
        <div className='col-span-3 relative mt-1'>
          <RulesSelectTraitElementCombobox
            traitElements={layers?.flatMap((layer) => layer.traitElements) || []}
            selected={selectedLeftTrait}
            onChange={setSelectedLeftTrait}
          />
        </div>
        <div className='col-span-2 relative mt-1'>
          <RulesSelectConditionCombobox selected={selectedCondition} onChange={setSelectedCondition} />
        </div>
        <div className='col-span-4 relative mt-1'>
          <RulesSelectTraitElementCombobox
            traitElements={allRightTraitElements || []}
            selected={selectedRightTrait}
            onChange={setSelectedRightTrait}
          />
        </div>
        <div className='col-span-1 relative mt-1 flex items-center right-0 justify-center space-x-3'>
          <button
            className='bg-white border border-mediumGrey text-black disabled:bg-disabledGray disabled:cursor-not-allowed disabled:text-white w-full h-full rounded-[5px] text-xs'
            onClick={() => {
              setSelectedLeftTrait(null)
              setSelectedRightTrait(null)
              setSelectedCondition(null)
            }}
          >
            Reset
          </button>
          <button
            className='bg-black disabled:bg-disabledGray disabled:cursor-not-allowed disabled:text-white w-full h-full rounded-[5px] text-white text-xs'
            disabled={!(selectedCondition && selectedLeftTrait && selectedRightTrait)}
            onClick={() => {
              setIsOpen(true)
            }}
          >
            Add
          </button>
          {selectedCondition && selectedLeftTrait && selectedRightTrait && (
            <RulesCreateModal
              visible={isOpen}
              onClose={() => setIsOpen(false)}
              onSuccess={() => {
                setSelectedLeftTrait(null)
                setSelectedRightTrait(null)
                setSelectedCondition(null)
              }}
              condition={selectedCondition}
              traitElements={[selectedLeftTrait, selectedRightTrait]}
            />
          )}
        </div>
      </div>
    </div>
  )
}
