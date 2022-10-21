// import { UserCircleIcon } from "@elevateart/ui";
import { ConnectButton as RainbowKitButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";
import React from "react";

interface ConnectButtonProps {
  disabled?: boolean;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  disabled = false,
}) => {
  const { data: session } = useSession();
  return (
    <RainbowKitButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <>
                    <button
                      disabled={disabled}
                      onClick={openConnectModal}
                      type="button"
                      className="flex items-center"
                    >
                      <img
                        src="/images/lightGray-wallet.svg"
                        className="p-2 w-12 h-12 inline-block border border-border rounded-primary"
                        alt="Wallet"
                      />
                    </button>
                  </>
                );
              }

              return (
                <button
                  disabled={disabled}
                  onClick={
                    chain.unsupported ? openChainModal : openAccountModal
                  }
                  type="button"
                >
                  {/* <span className='font-bold mr-3 text-xs'>{account.displayName}</span> */}
                  {session ? (
                    // <UserCircleIcon className="w-4 h-4 text-darkGrey" />
                    <></>
                  ) : (
                    <img
                      src="/images/lightGray-wallet.svg"
                      className="p-2 w-12 h-12 inline-block border border-border rounded-primary"
                      alt="Wallet"
                    />
                  )}
                </button>
              );
            })()}
          </div>
        );
      }}
    </RainbowKitButton.Custom>
  );
};
