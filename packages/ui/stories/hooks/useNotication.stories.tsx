import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Toaster, useNotification } from "../toast";

export default {
  title: "Hooks/useNotification",
  component: Toaster,
} as ComponentMeta<typeof Toaster>;

export const Success: ComponentStory<typeof Toaster> = (args) => {
  const { notifySuccess } = useNotification();
  return (
    <>
      <button
        onClick={() => notifySuccess("We like Fidenzas")}
        className="border border-border text-xs text-accents_4 p-2 rounded-primary"
      >
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
        className="border border-border text-xs text-accents_4 p-2 rounded-primary"
      >
        Show Toast
      </button>
      <Toaster {...args} />
    </>
  );
};
