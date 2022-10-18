import * as React from "react";
import toast from "react-hot-toast";
import { ToastContainer } from "./toast-container";

export const useNotification = () => {
  const notifySuccess = (message: React.ReactNode) => {
    return toast.custom(
      (t) => (
        <ToastContainer id={t.id} type="success">
          <div className="flex justify-between w-full items-center">
            <span>{message}</span>
          </div>
        </ToastContainer>
      ),
      {
        position: "bottom-right",
        duration: 2000,
      }
    );
  };

  const notifyError = (message: React.ReactNode) => {
    return toast.custom(
      (t) => (
        <ToastContainer id={t.id} type="error">
          <div className="flex justify-between w-full items-center">
            <span className="pr-4">{message}</span>
          </div>
        </ToastContainer>
      ),
      {
        position: "bottom-right",
        duration: 2000,
      }
    );
  };

  return {
    notifySuccess,
    notifyError,
  };
};
