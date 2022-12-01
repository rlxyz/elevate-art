import * as React from "react";
import toast from "react-hot-toast";
import { ToastContainer } from "./toast-container";

export const useNotification = () => {
  const notifySuccess = (message: React.ReactNode) => {
    return toast.custom(
      (t) => (
        <ToastContainer id={t.id} type="success">
          <div className="flex w-full items-center justify-between">
            <span>{message}</span>
          </div>
        </ToastContainer>
      ),
      {
        position: "bottom-right",
        duration: 2000,
      },
    );
  };

  const notifyError = (message: React.ReactNode) => {
    return toast.custom(
      (t) => (
        <ToastContainer id={t.id} type="error">
          <div className="flex w-full items-center justify-between">
            <span>{message}</span>
          </div>
        </ToastContainer>
      ),
      {
        position: "bottom-right",
        duration: 2000,
      },
    );
  };

  return {
    notifySuccess,
    notifyError,
  };
};
