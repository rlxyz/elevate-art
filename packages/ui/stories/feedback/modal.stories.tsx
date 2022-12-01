import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import Modal from "../../src/modal";

export default {
  title: "Feedback/Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

export const General: ComponentStory<typeof Modal> = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="rounded-primary border border-border p-2 text-xs text-accents_4">
        Show Modal
      </button>
      <Modal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        {...args}
        title="We like Fidenzas"
        description="Did you know that Fidenza is a place in Italy?"
      />
    </>
  );
};

export const withLoading: ComponentStory<typeof Modal> = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="rounded-primary border border-border p-2 text-xs text-accents_4">
        Show Modal
      </button>
      <Modal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        {...args}
        isLoading={true}
        title="We like Fidenzas"
        description="Did you know that Fidenza is a place in Italy?"
      />
    </>
  );
};
