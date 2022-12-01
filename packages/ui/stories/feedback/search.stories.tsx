import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Search } from "../../src";

export default {
  title: "Feedback/Search",
  component: Search,
} as ComponentMeta<typeof Search>;

export const General: ComponentStory<typeof Search> = (args) => <Search {...args} />;

export const withLoading: ComponentStory<typeof Search> = (args) => <Search {...args} isLoading={true} />;
