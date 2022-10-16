import { ComponentMeta, ComponentStory } from "@storybook/react";
import Breadcrumbs from "components/breadcrumbs";

export default {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  subcomponents: {
    BreadcrumbsItem: Breadcrumbs.Item,
    BreadcrumbsSeparator: Breadcrumbs.Separator,
  },
} as ComponentMeta<typeof Breadcrumbs>;

export const General: ComponentStory<typeof Breadcrumbs> = (args) => (
  <Breadcrumbs {...args}>
    <Breadcrumbs.Item>We</Breadcrumbs.Item>
    <Breadcrumbs.Item href="">Like</Breadcrumbs.Item>
    <Breadcrumbs.Item href="">Fidenzas</Breadcrumbs.Item>
  </Breadcrumbs>
);

// General.args = {
//   children: "We like Fidenzas.",
// };

// export const Highlight = Template.bind({});

// Highlight.args = {
//   color: true,
//   children: "We like Fidenzas.",
// };

// export const WithIconGeneral = Template.bind({});
// WithIconGeneral.args = {
//   children: "We like Fidenzas.",
//   icon: true,
// };

// export const WithIconHighlight = Template.bind({});
// WithIconHighlight.args = {
//   children: "We like Fidenzas.",
//   color: true,
//   icon: true,
// };

// export const Block = Template.bind({});

// Block.args = {
//   children: "We like Fidenzas.",
//   block: true,
// };

// export const BlockHighlight = Template.bind({});
// BlockHighlight.args = {
//   children: "We like Fidenzas.",
//   block: true,
//   color: true,
// };
