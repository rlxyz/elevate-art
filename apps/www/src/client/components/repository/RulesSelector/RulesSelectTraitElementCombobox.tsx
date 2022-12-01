import { Combobox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import {
  TraitElement,
  useQueryLayerElementFindAll,
} from "@hooks/trpc/layerElement/useQueryLayerElementFindAll";
import clsx from "clsx";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useDeepCompareEffect } from "src/client/hooks/utils/useDeepCompareEffect";
import { RulesComboboxInput } from "../RulesDisplay/RulesComboboxInput";

export const RulesSelectTraitElementCombobox = ({
  traitElements,
  selected,
  onChange,
}: {
  traitElements: TraitElement[];
  selected: null | TraitElement;
  onChange: Dispatch<SetStateAction<TraitElement | null>>;
}) => {
  const [query, setQuery] = useState("");
  const { all: layers } = useQueryLayerElementFindAll();
  const filteredTraits =
    query === ""
      ? traitElements
      : traitElements.filter((traitElement) => {
          return traitElement.name.toLowerCase().includes(query.toLowerCase());
        });
  useDeepCompareEffect(() => onChange(null), [traitElements]);
  if (!layers) return null;
  return (
    <Combobox as="div" value={selected} onChange={onChange}>
      <Combobox.Input
        as={RulesComboboxInput}
        className={clsx(selected && "border-blueHighlight")}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setQuery(event.target.value)
        }
        displayValue={(traitElement: TraitElement) => traitElement?.name}
        placeholder="Select Trait"
        traitElement={selected}
        layerName={
          layers.find((layer) => layer.id === selected?.layerElementId)?.name ||
          ""
        }
      />
      <Combobox.Button className="rounded-r-md absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none">
        <SelectorIcon className="text-darkGrey h-3 w-3" aria-hidden="true" />
      </Combobox.Button>
      {filteredTraits.length > 0 && (
        <Combobox.Options className="max-w-[calc(100% + 5rem)] rounded-md bg-white ring-black absolute z-10 mt-1 max-h-60 min-w-full overflow-auto py-1 text-base shadow-lg ring-1 ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredTraits.map((traitElement) => (
            <Combobox.Option
              key={traitElement.id}
              value={traitElement}
              className={({ active }) =>
                clsx(
                  "relative cursor-default select-none py-2 pl-3 pr-9",
                  active ? "text-blueHighlight" : "text-darkGrey",
                )
              }
            >
              {({ active, selected }) => (
                <>
                  <div className="flex flex-row items-center space-x-3">
                    <div className="relative h-[35px] w-[35px]">
                      <div className="border-mediumGrey absolute h-full w-full rounded-[5px] border">
                        <img
                          src={traitElement.imageUrl}
                          className="rounded-[3px]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                      <span
                        className={clsx(
                          "block truncate text-xs tracking-tight",
                          selected ? "font-semibold" : "",
                        )}
                      >
                        {
                          layers.filter(
                            (layer) => layer.id === traitElement.layerElementId,
                          )[0]?.name
                        }
                      </span>
                      <span
                        className={clsx(
                          "block truncate",
                          selected ? "font-semibold" : "",
                        )}
                      >
                        {traitElement.name}
                      </span>
                    </div>
                  </div>
                  {selected && (
                    <span
                      className={clsx(
                        "absolute inset-y-0 right-0 flex items-center pr-4",
                        active ? "text-white" : "text-indigo-600",
                      )}
                    >
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      )}
    </Combobox>
  );
};
