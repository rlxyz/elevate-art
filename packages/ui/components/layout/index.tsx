import Layout from "./layout";
import LayoutBody from "./layout-body";
import LayoutBodyItem from "./layout-body-item";
import LayoutHeader from "./layout-header";

export type LayoutBodyComponentType = typeof LayoutBody & {
  Item: typeof LayoutBodyItem;
};

export type LayoutComponentType = typeof Layout & {
  Body: LayoutBodyComponentType;
  Header: typeof LayoutHeader;
};

(LayoutBody as LayoutBodyComponentType).Item = LayoutBodyItem;

(Layout as LayoutComponentType).Body = LayoutBody as LayoutBodyComponentType;
(Layout as LayoutComponentType).Header = LayoutHeader;

export type { LayoutProps } from "./layout";
export default Layout as LayoutComponentType;
