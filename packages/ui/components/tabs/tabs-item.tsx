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

export type TabsItemProps = Props &
  Omit<React.HTMLAttributes<any>, keyof Props>;

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
          "relative flex items-center box-border cursor-pointer",
          "w-auto h-auto px-3 py-2 z-1",
          "outline-none capitalize whitespace-nowrap bg-transparent select-none text-xs",
          "hover:text-foreground hover:bg-accents_7",
          "absolute -bottom-[1px] rounded-secondary left-0 right-0 w-100% -height-[2px] transition-opacity",
          active && "text-foreground bg-accents_7 opacity-1 scale-x-100",
          disabled && "cursor-not-allowed text-accents_3"
        )}
        role="button"
        key={value}
        onMouseOver={onMouseOver}
        onClick={() => {
          if (disabled) return;
          onClick && onClick(value);
        }}
        style={active ? activeStyle : {}}
        data-geist="tab-item" // @todo fix this?
      >
        {label}
      </div>
    );
  };
  TabsInternalCell.displayName = "GeistTabsInternalCell";

  useEffect(() => {
    register && register({ value, cell: TabsInternalCell });
  }, [value, label, disabled]);

  /* eslint-disable react/jsx-no-useless-fragment */
  return isActive ? <>{children}</> : null;
};

TabsItemComponent.defaultProps = defaultProps;
TabsItemComponent.displayName = "TabsItem";
export default TabsItemComponent;
