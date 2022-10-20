import { ComponentMeta, ComponentStory } from "@storybook/react";
import LayoutFooter from "components/layout/layout-footer";

export default {
  title: "Layout/Footer",
  component: LayoutFooter,
} as ComponentMeta<typeof LayoutFooter>;

export const Template: ComponentStory<typeof LayoutFooter> = () => (
  <LayoutFooter />
);
