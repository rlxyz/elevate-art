import Layout from "./layout";
import LayoutBody from "./layout-body";
import LayoutBodyItem from "./layout-body-item";
import LayoutHeader from "./layout-header";

export type LayoutComponentType = typeof Layout & {
  Body: typeof LayoutBody;
  Header: typeof LayoutHeader;
};

(Layout as LayoutComponentType).Body = LayoutBody;
(Layout as LayoutComponentType).Header = LayoutHeader;

export type LayoutBodyComponentType = typeof LayoutBody & {
  Item: typeof LayoutBodyItem;
};

(LayoutBody as LayoutBodyComponentType).Item = LayoutBodyItem;

export type { LayoutProps } from "./layout";
export default Layout as LayoutComponentType;
