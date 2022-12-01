import { useState } from "react";
import { LayerElement, TraitElement } from "src/hooks/trpc/layerElement/useQueryLayerElementFindAll";
import { RulesType } from "src/shared/compiler";
import { RulesCreateModal } from "./RulesCreateModal";
import { RulesSelectConditionCombobox } from "./RulesSelectConditionCombobox";
import { RulesSelectTraitElementCombobox } from "./RulesSelectTraitElementCombobox";

export const RulesSelector = ({ layers }: { layers: LayerElement[] | undefined }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<null | RulesType>(null);
  const [selectedLeftTrait, setSelectedLeftTrait] = useState<null | TraitElement>(null);
  const [selectedRightTrait, setSelectedRightTrait] = useState<null | TraitElement>(null);

  // note: this will transform all rules in the selected trait to a standard format and return the trait ids that are already selected
  const allInvalidRightTraitElements = [...(selectedLeftTrait?.rulesPrimary || []), ...(selectedLeftTrait?.rulesSecondary || [])]
    .map((rule) => {
      if (selectedLeftTrait?.id === rule.primaryTraitElementId) {
        return {
          condition: rule.condition,
          from: rule.primaryTraitElementId,
          with: rule.secondaryTraitElementId,
        };
      } else {
        return {
          condition: rule.condition,
          from: rule.secondaryTraitElementId,
          with: rule.primaryTraitElementId,
        };
      }
    })
    .filter((rule) => {
      if (!selectedCondition) return true;
      return rule.condition === selectedCondition;
    })
    .map((rule) => rule.with);

  const allRightTraitElements = layers
    ?.filter((layer) => !selectedLeftTrait || (selectedLeftTrait && layer.id !== selectedLeftTrait.layerElementId))
    .flatMap((layer) => layer.traitElements)
    .filter((trait) => {
      if (!selectedLeftTrait) return true;
      return !allInvalidRightTraitElements.includes(trait.id);
    });

  return (
    <div className="flex w-full flex-col space-y-3">
      <div className="grid grid-cols-10 space-x-3">
        <div className="relative col-span-3 mt-1">
          <RulesSelectTraitElementCombobox
            traitElements={layers?.flatMap((layer) => layer.traitElements) || []}
            selected={selectedLeftTrait}
            onChange={setSelectedLeftTrait}
          />
        </div>
        <div className="relative col-span-2 mt-1">
          <RulesSelectConditionCombobox selected={selectedCondition} onChange={setSelectedCondition} />
        </div>
        <div className="relative col-span-4 mt-1">
          <RulesSelectTraitElementCombobox
            traitElements={allRightTraitElements || []}
            selected={selectedRightTrait}
            onChange={setSelectedRightTrait}
          />
        </div>
        <div className="relative right-0 col-span-1 mt-1 flex items-center justify-center space-x-3">
          <button
            className="bg-white border-mediumGrey text-black disabled:bg-disabledGray disabled:text-white h-full w-full rounded-[5px] border text-xs disabled:cursor-not-allowed"
            onClick={() => {
              setSelectedLeftTrait(null);
              setSelectedRightTrait(null);
              setSelectedCondition(null);
            }}
          >
            Reset
          </button>
          <button
            className="bg-black disabled:bg-disabledGray disabled:text-white text-white h-full w-full rounded-[5px] text-xs disabled:cursor-not-allowed"
            disabled={!(selectedCondition && selectedLeftTrait && selectedRightTrait)}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Add
          </button>
          {selectedCondition && selectedLeftTrait && selectedRightTrait && (
            <RulesCreateModal
              visible={isOpen}
              onClose={() => setIsOpen(false)}
              onSuccess={() => {
                setSelectedLeftTrait(null);
                setSelectedRightTrait(null);
                setSelectedCondition(null);
              }}
              condition={selectedCondition}
              traitElements={[selectedLeftTrait, selectedRightTrait]}
            />
          )}
        </div>
      </div>
    </div>
  );
};
