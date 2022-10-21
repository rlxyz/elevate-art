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
