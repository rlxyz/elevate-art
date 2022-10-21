import clsx from "clsx";

export interface Props {
  border?: "lower" | "upper" | "none";
}

const defaultProps: Props = {
  border: "lower",
};

export type LayoutContainerProps = Props &
  Omit<React.HTMLAttributes<any>, keyof Props>;

/**
 * Implements the LayoutContainer component. It handles the automatic border & width sizing
 * of the childrens. Note, we use the <article> tag to specific that each of the components
 * are independent.
 */
const LayoutContainerComponent: React.FC<
  React.PropsWithChildren<LayoutContainerProps>
> = ({
  children,
  className,
  border,
  ...props
}: React.PropsWithChildren<LayoutContainerProps>) => {
  return (
    <article
      {...props}
      className={clsx(
        "flex justify-center h-full w-full",
        className,
        border === "lower" && "border-b border-border",
        border === "upper" && "border-t border-border"
      )}
    >
      <div className="w-[90%] lg:w-[70%] 2xl:w-[75%] 3xl:w-[65%] h-full">
        {children}
      </div>
    </article>
  );
};

LayoutContainerComponent.defaultProps = defaultProps;
LayoutContainerComponent.displayName = "LayoutContainerComponent";
export default LayoutContainerComponent;
