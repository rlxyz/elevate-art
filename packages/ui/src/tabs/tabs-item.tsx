import clsx from "clsx";
import React, { useEffect, useMemo, useRef } from "react";
import { TabsInternalCellProps, useTabsContext } from "./tabs-context";

interface Props {
  label: string | React.ReactNode;
  value: string;
  disabled?: boolean;
}

const defaultProps: Props = {
  disabled: false,
  label: "",
  value: "",
};

export type TabsItemProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>;

const TabsItemComponent: React.FC<React.PropsWithChildren<TabsItemProps>> = ({
  children,
  value,
  label,
  disabled,
}: React.PropsWithChildren<TabsItemProps> & typeof defaultProps) => {
  const { register, currentValue } = useTabsContext();
  const isActive = useMemo(() => currentValue === value, [currentValue, value]);

  const TabsInternalCell: React.FC<TabsInternalCellProps> = ({
    onClick,
    onMouseOver,
    // @todo activeClassName - not being used. not sure what it does? sr: https://github.com/geist-org/geist-ui/blob/0381813bdbd7eae802d4792ae88c8336f3afacb9/components/tabs/tabs-item.tsx#L44
    activeClassName,
    activeStyle,
    hideBorder,
  }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const { currentValue } = useTabsContext();
    const active = currentValue === value;

    return (
      <div
        ref={ref}
        className={clsx(
          "relative box-border flex cursor-pointer items-center bg-transparent",
          "z-1 mx-1 h-auto w-auto py-3 px-2 first-of-type:ml-0",
          "text-inherit select-none whitespace-nowrap capitalize leading-normal outline-none",
          "hover:text-foreground",
          "after:transition-['transition: opacity, 200ms ease-in'] transform after:absolute after:-bottom-[1px] after:left-0 after:right-0 after:h-[2px] after:w-full after:rounded-secondary after:bg-foreground after:text-foreground after:opacity-0 after:content-['']",
          active ? "after:scale-x-100 after:opacity-100" : "after:scale-x-75",
          active ? "text-foreground" : "text-accents_5",
          disabled && "cursor-not-allowed hover:text-accents_3",
          hideBorder && "before:height-0 before:invisible before:block before:overflow-hidden before:font-semibold after:hidden",
          hideBorder && active && "text-semibold",
        )}
        role="button"
        key={value}
        onMouseOver={onMouseOver}
        onClick={() => {
          if (disabled) return;
          onClick && onClick(value);
        }}
        style={active ? activeStyle : {}}
        data-ui="tab-item" // @todo fix this? src: https://github.com/geist-org/geist-ui/blob/0381813bdbd7eae802d4792ae88c8336f3afacb9/components/tabs/tabs-item.tsx#L61
      >
        {label}
      </div>
    );
  };
  TabsInternalCell.displayName = "TabsInternalCell";

  useEffect(() => {
    register && register({ value, cell: TabsInternalCell });
  }, [value, label, disabled]);

  /* eslint-disable react/jsx-no-useless-fragment */
  return isActive ? <>{children}</> : null;
};

TabsItemComponent.defaultProps = defaultProps;
TabsItemComponent.displayName = "TabsItem";
export default TabsItemComponent;
