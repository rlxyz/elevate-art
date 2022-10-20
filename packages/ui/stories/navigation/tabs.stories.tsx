import { ComponentMeta, ComponentStory } from "@storybook/react";
import Tabs, { TabsComponentType } from "../tabs";

export default {
  title: "Navigation/Tabs",
  component: Tabs,
} as ComponentMeta<TabsComponentType>;

export const General: ComponentStory<TabsComponentType> = (args) => (
  <Tabs initialValue="Preview" {...args}>
    <Tabs.Item label={"Preview"} value={"Preview"} />
    <Tabs.Item label={"Rules"} value={"Rules"} />
    <Tabs.Item label={"Rarity"} value={"Rarity"} />
  </Tabs>
);

export const Disabled: ComponentStory<TabsComponentType> = (args) => (
  <Tabs initialValue="Preview" {...args}>
    <Tabs.Item label={"Preview"} value={"Preview"} />
    <Tabs.Item disabled label={"Rules"} value={"Rules"} />
    <Tabs.Item label={"Rarity"} value={"Rarity"} />
  </Tabs>
);

export const hideDivider: ComponentStory<TabsComponentType> = (args) => (
  <Tabs hideDivider initialValue="Preview" {...args}>
    <Tabs.Item label={"Preview"} value={"Preview"} />
    <Tabs.Item label={"Rules"} value={"Rules"} />
    <Tabs.Item label={"Rarity"} value={"Rarity"} />
  </Tabs>
);

export const hideBorder: ComponentStory<TabsComponentType> = (args) => (
  <Tabs hideBorder initialValue="Preview" {...args}>
    <Tabs.Item label={"Preview"} value={"Preview"} />
    <Tabs.Item label={"Rules"} value={"Rules"} />
    <Tabs.Item label={"Rarity"} value={"Rarity"} />
  </Tabs>
);
