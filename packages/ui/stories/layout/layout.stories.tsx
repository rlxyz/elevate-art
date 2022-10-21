import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Layout } from "../../src";

export default {
  title: "Layout/Index",
  component: Layout,
} as ComponentMeta<typeof Layout>;

export const Template: ComponentStory<typeof Layout> = (args) => (
  <Layout {...args} />
);
