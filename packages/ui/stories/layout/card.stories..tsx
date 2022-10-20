import { ComponentMeta, ComponentStory } from "@storybook/react";
import Card from "components/card";

export default {
  title: "Layout/Card",
  component: Card,
} as ComponentMeta<typeof Card>;

export const Template: ComponentStory<typeof Card> = (args) => (
  <Card {...args} />
);
