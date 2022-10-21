import { Button } from "@components/UI/Button";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

export default {
  title: "Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>{`I'm a button`}</Button>
);

export const BasicButton = Template.bind({});
