import { ComponentMeta, ComponentStory } from "@storybook/react";
import Tabs, { TabsComponentType } from "components/tabs";

export default {
  title: "Navigation/Tabs",
  component: Tabs,
} as ComponentMeta<TabsComponentType>;

export const General: ComponentStory<TabsComponentType> = (args) => (
  <Tabs {...args}>
    <Tabs.Item label={"Preview"} value={"Preview"} />
    <Tabs.Item label={"Rules"} value={"Rules"} />
    <Tabs.Item label={"Rarity"} value={"Rarity"} />
  </Tabs>
);
