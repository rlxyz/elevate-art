import { Notification } from "@components/Notification/Notification";
import { Button } from "@components/UI/Button";
import { LinkButton } from "@components/UI/LinkButton";
import { NETWORK_NAME } from "@utils/constant";
import toast from "react-hot-toast";
import { env } from "src/env/client.mjs";

export const useNotification = (projectName: string) => {
  const notifyError = ({
    message = "",
    duration = 10000,
  }: {
    message: string;
    duration?: number;
  }) => {
    return toast.custom(
      (t) => (
        <Notification id={t.id} type="error">
          <div className="flex justify-between w-full items-center">
            <div>
              <h3 className="font-bold text-base">Error</h3>
              <span className="block text-sm">{message}</span>
            </div>
            <div>
              <Button
                onClick={() => {
                  toast.dismiss(t.id);
                }}
                label="Close"
              />
            </div>
          </div>
        </Notification>
      ),
      {
        id: "message-notification",
        position: "bottom-right",
        duration: duration,
      }
    );
  };

  const notifySubmitted = (trxHash: string, duration = 8000) => {
    const transactionEtherscanUrl =
      env.NEXT_PUBLIC_NETWORK_ID === 1
        ? `https://etherscan.io/tx/${trxHash}`
        : `https://${
            NETWORK_NAME[config.networkId]
          }.etherscan.io/tx/${trxHash}`;
    return toast.custom(
      (t) => (
        <Notification id={t.id} type="success">
          <div className="flex justify-between w-full items-center">
            <div className="font-gilroy-light">
              <div className="font-bold mb-4">Transaction Submitted</div>
              <span className="block">View on Etherscan</span>
            </div>
            <div>
              <LinkButton href={transactionEtherscanUrl}>View</LinkButton>
            </div>
          </div>
        </Notification>
      ),
      {
        id: "message-notification",
        position: "bottom-right",
        duration: duration,
      }
    );
  };

  const notifySuccess = () => {
    return toast.custom(
      (t) => (
        <Notification id={t.id} type="success">
          <div className="flex justify-between w-full items-center">
            <div className="font-gilroy-light">
              <div className="font-bold mb-4">
                {`You've successfully minted a ${projectName} piece`}
              </div>
            </div>
          </div>
        </Notification>
      ),
      {
        id: "message-notification-success",
        position: "bottom-right",
        duration: 2000,
      }
    );
  };

  return {
    notifySubmitted,
    notifySuccess,
    notifyError,
  };
};
