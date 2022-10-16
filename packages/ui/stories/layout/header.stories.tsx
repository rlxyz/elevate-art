import { ComponentMeta, ComponentStory } from "@storybook/react";
import LayoutHeader from "components/layout/layout-header";

export default {
  title: "Layout/Header",
  component: LayoutHeader,
  //   parameters: {
  //     // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
  //     layout: "fullscreen",
  //   },
} as ComponentMeta<typeof LayoutHeader>;

export const Template: ComponentStory<typeof LayoutHeader> = () => (
  <LayoutHeader />
);

// export const LoggedOut = Template.bind({});

// export const LoggedIn = Template.bind({});

// // More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
// LoggedIn.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement);
//   const loginButton = await canvas.getByRole("button", { name: /Log in/i });
//   await userEvent.click(loginButton);
// };
