import { ComponentMeta, ComponentStory } from "@storybook/react";
import Loading from "components/loading";

export default {
  title: "Feedback/Loading",
  component: Loading,
} as ComponentMeta<typeof Loading>;

export const General: ComponentStory<typeof Loading> = (args) => (
  <Loading {...args} />
);

export const withText: ComponentStory<typeof Loading> = (args) => (
  <Loading {...args}>Loading</Loading>
);

export const withSpace: ComponentStory<typeof Loading> = (args) => (
  <Loading spaceRatio={3} {...args} />
);
