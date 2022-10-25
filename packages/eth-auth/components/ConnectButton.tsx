import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";

export const EthereumConnectButton = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              return (
                <button
                  onClick={
                    !connected
                      ? openConnectModal
                      : chain.unsupported
                      ? openChainModal
                      : openAccountModal
                  }
                  type="button"
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className="w-full h-full">{children}</div>
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
