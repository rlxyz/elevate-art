import clsx from "clsx";
import React from "react";

interface Props {
  count?: number;
  className?: string;
}

const defaultProps: Props = {
  className: "",
};

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type AvatarGroupProps = Props & NativeAttrs;

const AvatarGroupComponent: React.FC<
  React.PropsWithChildren<AvatarGroupProps>
> = ({
  count,
  className,
  children,
}: AvatarGroupProps & typeof defaultProps) => {
  const childrens = React.Children.toArray(children);
  return (
    <div
      className={clsx(
        className,
        "flex items-center w-[max-content] h-auto p-0 m-0"
      )}
    >
      {childrens.map((item, index) => (
        <div key={index} className={clsx(item !== 0 && "-mr-2")}>
          {item}
        </div>
      ))}
      {count && (
        <span
          className={clsx(
            "text-xs inline-flex items-center pl-3 text-foreground"
          )}
        >
          +{count}
        </span>
      )}
    </div>
  );
};

AvatarGroupComponent.defaultProps = defaultProps;
AvatarGroupComponent.displayName = "AvatarGroup";
export default AvatarGroupComponent;
