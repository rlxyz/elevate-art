import React from "react";
import { Button } from "@components/Button";
import { ButtonLink } from "@components/ButtonLink";
import { useWallet } from "@hooks/useWallet";

interface MintSectionProps {
  mintPhase: string;
  amount: number;
  helperText: string | React.ReactFragment;
  userMaxMintCount: number;
  setAmount: Function;
  overrideMintCount?: boolean;
  handleMint: () => void;
  soldOut?: boolean;
}

export const MintSection: React.FC<MintSectionProps> = ({
  mintPhase,
  amount,
  userMaxMintCount,
  helperText,
  setAmount,
  overrideMintCount = false,
  handleMint,
  soldOut,
}) => {
  const { isWalletConnected, connect } = useWallet();

  const allButtonDisabled =
    !isWalletConnected || mintPhase === "none" || userMaxMintCount <= 0;

  if (soldOut) {
    return (
      <div className="w-full">
        <div className="text-white pt-20 px-20 md:pt-32 flex flex-col text-center">
          <div className="text-2xl font-kiona-bold mb-2">Sold Out</div>
          <div className="text-base font-gilroy-ultra-light mb-6">
            {`We’re out - but you can buy the collection on OpenSea`}
          </div>
          <div className="flex justify-center">
            <ButtonLink
              className="py-2 px-16 text-base bg-[#191b23] text-white w-[200px]"
              label="OpenSea"
              href="https://opensea.io/collection/dreamlab-reflections"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-white  pt-10 5xl:pt-36 text-center">
        <span className="text-2xl font-bold font-kiona">
          {isWalletConnected && mintPhase === "claim"
            ? "Free Claim Window"
            : mintPhase === "presale"
            ? "Presale Window"
            : mintPhase === "Public Window"}
        </span>
      </div>
      <div
        className={`flex w-[200px] m-auto py-20 justify-${
          !overrideMintCount ? "between" : "center"
        }`}
      >
        {!overrideMintCount && (
          <Button
            disabled={allButtonDisabled || amount <= 1}
            className="w-[40px] h-[40px] rounded-full text-2xl text-white bg-[#191b23]"
            onClick={(e) => {
              if (amount > 1) {
                setAmount((prev) => prev - 1);
              }
            }}
            label="-"
          />
        )}
        <span className="text-white text-2xl font-bold justify-center items-center">
          {overrideMintCount ? userMaxMintCount : amount}
        </span>
        {!overrideMintCount && (
          <Button
            disabled={allButtonDisabled || amount === userMaxMintCount}
            className="w-[40px] h-[40px] rounded-full text-2xl text-white bg-[#191b23]"
            onClick={(e) => {
              setAmount((prevVal) => prevVal + 1);
            }}
            label="+"
          />
        )}
      </div>
      <div className="flex justify-center">
        {isWalletConnected ? (
          <Button
            disabled={allButtonDisabled}
            className="py-2 px-16 text-base bg-[#191b23] text-white"
            label="Mint"
            onClick={handleMint}
          />
        ) : (
          <Button
            className="py-2 px-16 text-base bg-[#191b23] text-white"
            label="Connect"
            onClick={connect}
          />
        )}
      </div>
      <div className="text-center text-white mt-5 font-gilroy-light">
        {helperText}
      </div>
    </div>
  );
};
