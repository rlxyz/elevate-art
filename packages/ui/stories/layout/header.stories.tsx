import { ComponentMeta, ComponentStory } from "@storybook/react";
import LayoutHeader from "components/layout/layout-header";

export default {
  title: "Layout/Header",
  component: LayoutHeader,
} as ComponentMeta<typeof LayoutHeader>;

export const Template: ComponentStory<typeof LayoutHeader> = () => (
  <LayoutHeader
    appNavigationRoutes={[
      {
        name: "tylerhobbs",
        href: "/tylerhobbs",
        disabled: false,
      },
      {
        name: "fidenza",
        href: "/tylerhobbs/fidenza",
        disabled: false,
      },
    ]}
    pageNavigationRoutes={[
      {
        name: "Preview",
        href: "/tylerhobbs/fidenza/preview",
        disabled: false,
      },
      {
        name: "Rarity",
        href: "/tylerhobbs/fidenza/rarity",
        disabled: false,
      },
      {
        name: "Rules",
        href: "/tylerhobbs/fidenza/rules",
        disabled: false,
      },
    ]}
  />
);
