import { TrashIcon } from "@heroicons/react/outline";
import { useState } from "react";
import {
    Rules,
    useQueryLayerElementFindAll
} from "src/hooks/trpc/layerElement/useQueryLayerElementFindAll";
import { RulesComboboxInput } from "./RulesComboboxInput";
import { RulesDeleteModal } from "./RulesDeleteModal";

export const RulesDisplayOneItem = ({ rule }: { rule: Rules }) => {
  const { primaryTraitElementId, secondaryTraitElementId, condition } = rule;
  const { all: layers } = useQueryLayerElementFindAll(); // @todo remove this
  const [isOpen, setIsOpen] = useState(false);
  const allTraitElements = layers.flatMap((x) => x.traitElements);
  const primary = allTraitElements.find((x) => x.id === primaryTraitElementId);
  const secondary = allTraitElements.find(
    (x) => x.id === secondaryTraitElementId,
  );
  if (typeof primary === "undefined" || typeof secondary === "undefined")
    return null;
  const primaryLayer = layers?.find((l) =>
    l.traitElements.find((t) => t.id === primary.id),
  );
  const secondaryLayer = layers?.find((l) =>
    l.traitElements.find((t) => t.id === secondary.id),
  );

  return (
    <div className="text-darkGrey grid grid-cols-10 space-x-3">
      <div className="relative col-span-3 h-full">
        <RulesComboboxInput
          traitElement={primary}
          layerName={primaryLayer?.name || ""}
          highlight={false}
        />
      </div>
      <div className="relative col-span-2 h-full">
        <div className="border-mediumGrey bg-hue-light h-full w-full overflow-hidden rounded-[5px] border py-2 pl-3 text-xs">
          {condition}
        </div>
      </div>
      <div className="relative col-span-4 h-full">
        <RulesComboboxInput
          traitElement={secondary}
          layerName={secondaryLayer?.name || ""}
          highlight={false}
        />
      </div>
      <div className="relative right-0 col-span-1 flex h-full items-center justify-center">
        <button
          className="bg-white disabled:bg-white disabled:text-mediumGrey flex w-full justify-center"
          onClick={() => setIsOpen(true)}
        >
          <TrashIcon className="text-mediumGrey h-4 w-4" />
        </button>
        <RulesDeleteModal
          visible={isOpen}
          onClose={() => setIsOpen(false)}
          rule={rule}
        />
      </div>
    </div>
  );
};
