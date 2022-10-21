import { RightContentContainer } from "@components/Layout/RightContentContainer";
import { Button } from "@components/UI/Button";
import { Textbox } from "@components/UI/Textbox";
import { CheckWalletResult, useWalletCheck } from "@hooks/useWalletCheck";
import { useDebouncedState } from "@react-hookz/web";

import { PresaleCountdown } from "./PresaleCountdown";

const CheckResult = ({ result }: { result?: CheckWalletResult }) => {
  if (!result) {
    return null;
  }

  const message = result.isValid ? (
    <span>
      You can <strong>{`mint ${result.allocation} NFTs`}</strong> from this
      collection
    </span>
  ) : (
    <span>
      The wallet address is <strong>not on the Allow list</strong>
    </span>
  );

  return (
    <div className="flex justify-between items-center">
      {message}
      <img
        src={`/images/${result.isValid ? "tick.svg" : "untick.svg"}`}
        className="w-5 h-5"
        alt={result.isValid ? "Wallet Valid" : "Wallet Not Valid"}
      />
    </div>
  );
};

export const WalletChecker = () => {
  const [address, setAddress] = useDebouncedState<string>("", 300, 500);
  const { result, checkWallet } = useWalletCheck(address);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkWallet();
  };

  return (
    <RightContentContainer
      firstHeading={<PresaleCountdown />}
      secondHeading={
        <>
          <span>
            Check if your Wallet Address is on the <strong>Allow List</strong>
          </span>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex mt-2 mb-8">
        <div className="mr-5 w-full">
          <Textbox
            id="walletAddress"
            name="walletAddress"
            placeholder="0x25...94cE"
            onChange={(e) => setAddress(e.currentTarget.value)}
          />
        </div>
        <div>
          <Button label="Check" disabled={!checkWallet} type="submit" />
        </div>
      </form>
      <hr className="border-lightGray" />
      <div className="mt-8 mb-5">
        <CheckResult result={result} />
      </div>
    </RightContentContainer>
  );
};
