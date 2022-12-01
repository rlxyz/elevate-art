import clsx from "clsx";
import React from "react";

// @todo implement all different variations: success/error/default/etc

interface Props {
  color?: string;
  className?: string;
  spaceRatio?: number;
}

const defaultProps: Props = {
  className: "",
  spaceRatio: 1,
};

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type LoadingProps = Props & NativeAttrs;

const LoadingComponent: React.FC<React.PropsWithChildren<LoadingProps>> = ({
  children,
  color,
  className,
  spaceRatio,
  ...props
}: React.PropsWithChildren<LoadingProps> & typeof defaultProps) => {
  return (
    <div className={clsx(className, "min-h-4 relative m-0 inline-flex h-full w-full items-center justify-center p-0 text-xs")} {...props}>
      <span className="absolute top-1/2 left-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center bg-transparent">
        {children && <label className="mr-2 leading-none text-accents_5">{children}</label>}
        <i
          className="inline-block h-1 w-1 animate-pulse rounded-full bg-accents_5"
          style={{
            margin: `0 calc(0.25em / 2 * ${spaceRatio})`,
          }}
        />
        <i
          className="inline-block h-1 w-1 animate-pulse rounded-full bg-accents_5"
          style={{
            margin: `0 calc(0.25em / 2 * ${spaceRatio})`,
            animationDelay: "0.2s",
          }}
        />
        <i
          className="inline-block h-1 w-1 animate-pulse rounded-full bg-accents_5"
          style={{
            margin: `0 calc(0.25em / 2 * ${spaceRatio})`,
            animationDelay: "0.4s",
          }}
        />
      </span>
    </div>
  );
};

LoadingComponent.defaultProps = defaultProps;
LoadingComponent.displayName = "Loading";
export default LoadingComponent;
