import clsx from "clsx";
import React from "react";

interface Props {
  className?: string;
}

const defaultProps: Props = {
  className: "",
};

export type BreadcrumbsSeparatorProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>;

const BreadcrumbsSeparatorComponent: React.FC<React.PropsWithChildren<BreadcrumbsSeparatorProps>> = ({
  children,
  className,
}: BreadcrumbsSeparatorProps & typeof defaultProps) => {
  return <div className={clsx(className, "pointer-events-none mx-0.5 inline-flex h-auto w-auto items-center")}>{children}</div>;
};

BreadcrumbsSeparatorComponent.defaultProps = defaultProps;
BreadcrumbsSeparatorComponent.displayName = "BreadcrumbsSeparator";
export default BreadcrumbsSeparatorComponent;
