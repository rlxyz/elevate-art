import clsx from "clsx";
import Breadcrumbs from "components/breadcrumbs";
import Link from "components/link";
import Tabs from "components/tabs";
import { FC, HTMLAttributes, PropsWithChildren } from "react";
import {
  externalRoutes,
  NavigationRoutes,
  socialRoutes,
} from "../elevateart-external-links";
import LayoutContainer from "./layout-container";

export interface Props {
  appNavigationRoutes?: NavigationRoutes[];
  pageNavigationRoutes?: NavigationRoutes[];
  isEthereumConnectable?: boolean;
}

const defaultProps: Props = {
  appNavigationRoutes: [],
  pageNavigationRoutes: [],
  isEthereumConnectable: false,
};

export type LayoutContainerProps = Props &
  Omit<HTMLAttributes<any>, keyof Props>;

/**
 * The core navigation component for applications.
 * There are three sections to this component:
 * - appNavigationRoutes: These are the routes that are always present in the header.
 * - pageNavigationRoutes: These are the routes that are specific to the page.
 * - isEthereumConnectable: This is a flag that determines if the ethereum connect button should be shown.
 *
 * Example:
 * - a landing page wouldnt have the pageNavigationRoutes.
 * - it would instantiate an empty array of appNavigationRoutes
 */
const LayoutHeaderComponent: FC<PropsWithChildren<LayoutContainerProps>> = ({
  appNavigationRoutes,
  pageNavigationRoutes,
  className,
  children,
  ...props
}: PropsWithChildren<LayoutContainerProps>) => {
  const appNavigationRoutesFinal = [
    {
      name: "Elevate Art",
      href: "/",
      disabled: false,
      icon: (props: any) => (
        <img src="public/images/logo-black.png" {...props} />
      ),
    },
    ...(appNavigationRoutes || []),
  ];

  const externalNavigationRoutesFinal = [...externalRoutes, ...socialRoutes];

  const topNav = (
    <div className="flex justify-between items-center">
      {/* App Navigation on the left side of the Header */}
      <Breadcrumbs className="space-x-2">
        {appNavigationRoutesFinal.map((item) => {
          return (
            <Breadcrumbs.Item key={item.name} href={item.href}>
              {item.icon ? (
                <item.icon className="h-8 w-8" aria-hidden="true" />
              ) : (
                <>{item.name}</>
              )}
            </Breadcrumbs.Item>
          );
        })}
      </Breadcrumbs>

      {/* External Routes Navigation on the right side of the Header */}
      <div className="flex flex-row justify-center items-center space-x-3">
        {externalNavigationRoutesFinal.map((item) => {
          return (
            <Link key={item.href} href={item.href}>
              {item.icon ? (
                <item.icon
                  className="h-4 w-4 text-accents_6"
                  aria-hidden="true"
                />
              ) : (
                <span className="text-accents_6">{item.name}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  const bottomNav = (
    <Tabs hideDivider>
      {pageNavigationRoutes?.map((route) => {
        return <Tabs.Item label={route.name} value={route.name} />;
      })}
    </Tabs>
  );

  return (
    <LayoutContainer
      {...props}
      border="lower"
      className={clsx(className, "min-h-[3.5rem] max-h-[5.64rem]")}
    >
      <header>
        {topNav}
        {bottomNav}
      </header>
    </LayoutContainer>
  );
};

LayoutHeaderComponent.defaultProps = defaultProps;
LayoutHeaderComponent.displayName = "LayoutHeaderComponent";
export default LayoutHeaderComponent;
