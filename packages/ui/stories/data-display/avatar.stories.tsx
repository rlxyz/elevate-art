import { ComponentMeta, ComponentStory } from "@storybook/react";
import Avatar from "../../src/avatar";

const url = "images/avatar.jpeg";

export default {
  title: "Data-Display/Avatar",
  component: Avatar,
} as ComponentMeta<typeof Avatar>;

export const General: ComponentStory<typeof Avatar> = (args) => (
  <>
    <Avatar src={url} />
    <Avatar src={url} />
    <Avatar src={url} />
    <Avatar src={url} />
    <Avatar src={url} isSquare />
    <Avatar src={url} isSquare />
    <Avatar src={url} isSquare />
    <Avatar src={url} isSquare />
  </>
);

export const Text: ComponentStory<typeof Avatar> = (args) => (
  <>
    <Avatar text="F" />
    <Avatar text="I" />
    <Avatar text="D" />
    <Avatar text="E" />
    <Avatar text="N" />
    <Avatar text="Z" />
    <Avatar text="A" />
  </>
);

export const Group: ComponentStory<typeof Avatar> = (args) => (
  <>
    <Avatar.Group>
      <Avatar src={url} />
      <Avatar src={url} />
      <Avatar src={url} />
      <Avatar src={url} />
    </Avatar.Group>
    <Avatar.Group count={12}>
      <Avatar src={url} />
      <Avatar text="AG" />
      <Avatar text="v" />
    </Avatar.Group>
  </>
);
