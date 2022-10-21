import { Spinner } from "@components/Spinner/Spinner";
import { ComponentMeta } from "@storybook/react";
import React from "react";

export default {
  title: "Spinner",
  component: Spinner,
} as ComponentMeta<typeof Spinner>;

export const BasicSpinner = () => <Spinner />;
