import LayoutContainer from "./layout-container";
import LayoutFooter from "./layout-footer";
export interface Props {
  hasFooter?: boolean;
}

const defaultProps: Props = {
  hasFooter: true,
};

export type LayoutProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>;

/**
 * Implements the Layout component. It is used to wrap the entire application.
 */
const LayoutComponent: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
  hasFooter,
  ...props
}: React.PropsWithChildren<LayoutProps>) => {
  return (
    <main {...props}>
      {children}
      {hasFooter ? (
        <LayoutContainer
          border="upper"
          className="min-h-[3.5rem] flex items-center"
        >
          <LayoutFooter />
        </LayoutContainer>
      ) : null}
    </main>
  );
};

LayoutComponent.defaultProps = defaultProps;
LayoutComponent.displayName = "LayoutComponent";
export default LayoutComponent;
