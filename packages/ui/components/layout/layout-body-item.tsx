import LayoutContainer, {
  Props as LayoutContainerProps,
} from "./layout-container";

export interface Props extends LayoutContainerProps {}

const defaultProps: Props = {
  border: "lower",
};

export type LayoutBodyProps = Props &
  Omit<React.HTMLAttributes<any>, keyof Props>;

/**
 * Implements the LayoutBody component. Enforces that the body will be at least
 * the height of the viewport height minus the (footer + header) height.
 */
const LayoutBodyItemComponent: React.FC<
  React.PropsWithChildren<LayoutBodyProps>
> = ({
  children,
  border,
  ...props
}: React.PropsWithChildren<LayoutBodyProps>) => {
  return (
    <LayoutContainer border={border} className="min-h-[3.5rem]" {...props}>
      <div className="-ml-2">{children}</div>
    </LayoutContainer>
  );
};

LayoutBodyItemComponent.defaultProps = defaultProps;
LayoutBodyItemComponent.displayName = "LayoutBodyItemComponent";
export default LayoutBodyItemComponent;
