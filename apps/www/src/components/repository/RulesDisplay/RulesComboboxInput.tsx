import clsx from "clsx";
import { forwardRef, HTMLProps } from "react";
import { TraitElement } from "src/hooks/trpc/layerElement/useQueryLayerElementFindAll";

type RulesComboboxInputProps = {
  highlight?: boolean;
  layerName: string;
  traitElement: TraitElement | null | undefined;
};
export const RulesComboboxInput = forwardRef<HTMLInputElement, RulesComboboxInputProps & HTMLProps<RulesComboboxInputProps>>(
  ({ highlight = true, layerName, traitElement, placeholder, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "bg-hue-light flex w-full items-center space-x-2 rounded-[5px] border border-border pl-3 pr-10 text-xs",
          highlight && traitElement && "border-success",
          className,
        )}
      >
        {traitElement ? (
          <>
            <div className="flex flex-row items-center space-x-3 py-2">
              <div className="flex flex-row items-center space-x-2">
                <span className={clsx("block truncate text-xs tracking-tight text-accents_5")}>{layerName}</span>
                <span className={clsx("block truncate text-xs text-foreground")}>{traitElement.name}</span>
              </div>
            </div>
          </>
        ) : (
          <input className="h-full w-full py-2 focus:outline-none" placeholder={placeholder} />
        )}
      </div>
    );
  },
);

RulesComboboxInput.displayName = "ComboboxInput";
