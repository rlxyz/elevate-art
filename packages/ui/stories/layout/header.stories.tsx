import { ComponentMeta, ComponentStory } from "@storybook/react";
import LayoutHeaderComponent from "../../src/layout/layout-header";

export default {
  title: "Layout/Header",
  component: LayoutHeaderComponent,
} as ComponentMeta<typeof LayoutHeaderComponent>;

export const Template: ComponentStory<typeof LayoutHeaderComponent> = () => (
  <LayoutHeaderComponent
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
