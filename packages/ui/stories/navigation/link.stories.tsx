import { ComponentMeta, ComponentStory } from "@storybook/react";
import Link from "components/link";

export default {
  title: "Navigation/Link",
  component: Link,
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = (args) => <Link {...args} />;

export const General = Template.bind({});

General.args = {
  children: "We like Fidenzas.",
};

export const Highlight = Template.bind({});

Highlight.args = {
  color: true,
  children: "We like Fidenzas.",
};

export const WithIconGeneral = Template.bind({});
WithIconGeneral.args = {
  children: "We like Fidenzas.",
  icon: true,
};

export const WithIconHighlight = Template.bind({});
WithIconHighlight.args = {
  children: "We like Fidenzas.",
  color: true,
  icon: true,
};

export const Block = Template.bind({});

Block.args = {
  children: "We like Fidenzas.",
  block: true,
};

export const BlockHighlight = Template.bind({});
BlockHighlight.args = {
  children: "We like Fidenzas.",
  block: true,
  color: true,
};
