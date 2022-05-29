import * as React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  label?: string;
}

export const Button = ({
  label,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button className={`${styles.button} ${className}`} type={type} {...props}>
      {label || children}
    </button>
  );
};
