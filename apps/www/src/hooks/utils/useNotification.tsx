import * as React from "react";
import toast from "react-hot-toast";
import { Notification } from "src/components/layout/core/Notification";

export const useNotification = () => {
  const notifySuccess = (message: React.ReactNode) => {
    return toast.custom(
      (t) => (
        <Notification id={t.id} type="success">
          <div className="flex w-full items-center justify-between">
            <span>{message}</span>
          </div>
        </Notification>
      ),
      {
        position: "bottom-right",
        duration: 2000,
      },
    );
  };

  const notifyError = (message: string) => {
    return toast.custom(
      (t) => (
        <Notification id={t.id} type="error">
          <div className="flex w-full items-center justify-between">
            <span className="pr-4">{message}</span>
          </div>
        </Notification>
      ),
      {
        position: "bottom-right",
        duration: 2000,
      },
    );
  };

  const notifyInfo = (message: string) => {
    return toast.custom(
      (t) => (
        <Notification id={t.id} type="info">
          <div className="flex w-full items-center justify-between">
            <span className="pr-4">{message}</span>
          </div>
        </Notification>
      ),
      {
        position: "bottom-center",
        duration: 2000,
      },
    );
  };

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
  };
};
