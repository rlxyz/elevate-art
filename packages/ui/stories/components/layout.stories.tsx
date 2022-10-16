import { ComponentMeta, ComponentStory } from "@storybook/react";
import Layout from "components/layout";

export default {
  title: "Layout/Index",
  component: Layout,
  //   parameters: {
  //     // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
  //     layout: "fullscreen",
  //   },
} as ComponentMeta<typeof Layout>;

export const Template: ComponentStory<typeof Layout> = (args) => (
  <Layout {...args} />
);

// export const LoggedOut = Template.bind({});

// export const LoggedIn = Template.bind({});

// // More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
// LoggedIn.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement);
//   const loginButton = await canvas.getByRole("button", { name: /Log in/i });
//   await userEvent.click(loginButton);
// };
