export interface Props {}

const defaultProps: Props = {};

export type LayoutBodyProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>;

/**
 * Implements the LayoutBody component. Enforces that the body will be at least
 * the height of the viewport height minus the (footer + header) height.
 */
const LayoutBodyComponent: React.FC<React.PropsWithChildren<LayoutBodyProps>> = ({
  children,
  ...props
}: React.PropsWithChildren<LayoutBodyProps>) => {
  return (
    <div className="min-h-[calc(100vh-9.14rem)]" {...props}>
      {children}
    </div>
  );
};

LayoutBodyComponent.defaultProps = defaultProps;
LayoutBodyComponent.displayName = "LayoutBodyComponent";
export default LayoutBodyComponent;
