import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useNotification } from "../../src";
import Toaster from "../../src/toast";

export default {
  title: "Hooks/useNotification",
  component: Toaster,
} as ComponentMeta<typeof Toaster>;

export const Success: ComponentStory<typeof Toaster> = (args) => {
  const { notifySuccess } = useNotification();
  return (
    <>
      <button onClick={() => notifySuccess("We like Fidenzas")} className="rounded-primary border border-border p-2 text-xs text-accents_4">
        Show Toast
      </button>
      <Toaster {...args} />
    </>
  );
};

export const Error: ComponentStory<typeof Toaster> = (args) => {
  const { notifyError } = useNotification();
  return (
    <>
      <button
        onClick={() => notifyError("We still like Fidenzas")}
        className="rounded-primary border border-border p-2 text-xs text-accents_4"
      >
        Show Toast
      </button>
      <Toaster {...args} />
    </>
  );
};
