import clsx from "clsx";
import React from "react";

interface Props {
  className?: string;
}

const defaultProps: Props = { className: "" };

export type CardProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>;

const CardComponent: React.FC<React.PropsWithChildren<CardProps>> = ({
  children,
  className,
  ...props
}: CardProps & typeof defaultProps) => {
  return (
    <div className={clsx(className, "box-border rounded-primary border border-border bg-background p-4 transition-all")} {...props}>
      {children}
    </div>
  );
};

CardComponent.defaultProps = defaultProps;
CardComponent.displayName = "Card";
export default CardComponent;
