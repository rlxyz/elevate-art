import * as React from "react";

interface Props {
  children: React.ReactNode;
  id: string;
  type: "success" | "error";
}

export const Notification = ({ children, id, type }: Props) => {
  const color = type === "success" ? "border-blend-pink" : "border-x-red-700";
  return (
    <div
      id={id}
      className="relative w-[450px] max-w-lg px-4 py-8 rounded-lg shadow bg-gray-800 text-gray-300 z-0"
      role="alert"
    >
      <div
        className={`absolute left-0 top-[15px] h-[86px] border-l-4 ${color} border-dotted`}
      ></div>
      <div className="w-full flex items-center">{children}</div>
    </div>
  );
};
