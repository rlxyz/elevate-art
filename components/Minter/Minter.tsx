import { useState, useMemo, Fragment } from "react";
import { Button } from "@components/Button";
import {
  setSuccessfulTransactionHash,
  setSuccessfulTransactionHashWithPhase,
} from "@utils/cookies";
import { COLLECTION_DISTRIBUTION } from "@utils/constant";
import styles from "./Minter.module.scss";
import { Token } from "state/token";
import { useWallet } from "@hooks/useWallet";
import { useNotify } from "@hooks/useNotify";
import { TopEdgeBorder, BottomEdgeBorder } from "./Icons";
import { motion } from "framer-motion";
import { MintSection } from "./MintSection";
import { Spinner } from "@components/Spinner";
import { useGetTokenIds } from "@hooks/useGetTokenIds";
import { useAssetReveal } from "@hooks/useAssetReveal";
import Carousel from "nuka-carousel";
import Zoom from "react-medium-image-zoom";
import { LooksRare, OpenSea } from "@components/Layout/Socials/Icons";
import SocialButton from "@components/Layout/Socials/SocialButton";

const mainBox = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 2,
      staggerChildren: 0.2,
    },
  },
};

const mainComponent = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 3,
      staggerChildren: 0.2,
    },
  },
};

export const Minter = () => {
  const [amount, setAmount] = useState(1);
  const { isWalletConnected, address } = useWallet();
  const { notifyError } = useNotify();
  const [slideIndex, setSlideIndex] = useState(0);
  const {
    dataLoading,
    claimMaxInvocation,
    presaleMaxInvocation,
    publicMaxInvocation,
    presaleMint,
    publicMint,
    claimMint,
    mintPhase,
    mintCount,
    totalSupply,
  } = Token.useContainer();

  const [mintInProgress, setMintInProgress] = useState<boolean>(false);

  const { data: tokenIds, isLoading: fetchingTokenIds } = useGetTokenIds(
    address,
    mintPhase
  );
  const { data: assets, isLoading: fetchingImages } = useAssetReveal(
    address,
    tokenIds
  );

  const userCanMintCount = useMemo(() => {
    if (mintPhase === "none") {
      return 0;
    }

    if (mintPhase === "claim") {
      return claimMaxInvocation - mintCount;
    }

    if (mintPhase === "presale") {
      return presaleMaxInvocation - mintCount;
    }

    return publicMaxInvocation;
  }, [
    mintCount,
    mintPhase,
    claimMaxInvocation,
    presaleMaxInvocation,
    publicMaxInvocation,
  ]);

  const revealInProgress = fetchingTokenIds || fetchingImages;

  const mintCallback = (txHash: string) => {
    if (mintPhase === "claim") {
      setSuccessfulTransactionHash(address, txHash);
    }

    if (mintPhase === "presale" || mintPhase === "public") {
      setSuccessfulTransactionHashWithPhase(address, txHash, mintPhase);
    }
  };

  const mint = async () => {
    setMintInProgress(true);
    try {
      if (mintPhase === "public") {
        await publicMint(amount, mintCallback);
      } else if (mintPhase === "claim") {
        await claimMint(claimMaxInvocation, mintCallback);
      } else {
        await presaleMint(amount, mintCallback);
      }
      setAmount(1);
    } catch (err) {
      console.error({ err });
      notifyError({
        message: err?.error?.message || err?.message,
        err,
      });
    }
    setMintInProgress(false);
  };

  const helperText = useMemo(() => {
    if (!isWalletConnected) {
      return "Connect your wallet to mint";
    }

    if (mintPhase == "none") {
      return "We are not live yet";
    }

    switch (mintCount) {
      case 2:
        return `You have minted ${mintCount} and reached max mint.`;
      case 1:
        if (mintPhase === "claim") {
          return (
            <>
              You have minted max allocation for free claims
              <br />
              Try again in the next phase
            </>
          );
        } else if (mintPhase === "presale" || mintPhase === "public") {
          return (
            <>
              You have minted {mintCount}
              <br />
              {userCanMintCount > 0
                ? `And have ${userCanMintCount} left to purchase in the ${mintPhase} mint`
                : "You dont have allocations for this round"}
            </>
          );
        }
      default:
    }

    if (mintPhase === "claim") {
      return userCanMintCount > 0
        ? `You can claim ${userCanMintCount} Reflection${
            userCanMintCount > 1 ? "s" : ""
          } for free`
        : "Sorry, you dont have any free claims. Check back during the presale.";
    }

    if (mintPhase === "presale") {
      return userCanMintCount > 0
        ? `You can mint up to ${userCanMintCount}`
        : "Sorry, you dont have any presale allocations. Come back for public.";
    }

    return userCanMintCount > 0
      ? `You can mint up to ${userCanMintCount} Reflection${
          userCanMintCount > 1 ? "s" : ""
        }`
      : "Sorry, you may have minted max allocation or collection has sold out";
  }, [isWalletConnected, mintPhase, userCanMintCount, mintCount]);

  const renderMainComponent = () => {
    if (dataLoading || mintInProgress) {
      return <Spinner />;
    }

    if (revealInProgress) {
      return (
        <>
          <Spinner />
          <div className="text-white text-xs text-center mt-2">
            Image generation is in progress
          </div>
        </>
      );
    }

    if (assets?.length > 0) {
      return (
        <>
          <Carousel
            defaultControlsConfig={{
              prevButtonStyle: {
                display: assets?.length > 1 ? "block" : "none",
              },
              nextButtonStyle: {
                display: assets?.length > 1 ? "block" : "none",
              },
            }}
            animation="zoom"
            afterSlide={(slideIndex) => setSlideIndex(slideIndex)}
          >
            {assets.map((asset, index) => (
              <Fragment key={tokenIds[index]}>
                <Zoom key={index} overlayBgColorEnd="#000000">
                  <img
                    src={asset.image}
                    alt={`Reflection #${tokenIds[index]} Image`}
                  />
                </Zoom>
              </Fragment>
            ))}
          </Carousel>
        </>
      );
    }

    return (
      <MintSection
        mintPhase={mintPhase}
        amount={amount}
        helperText={helperText}
        userMaxMintCount={userCanMintCount}
        overrideMintCount={mintPhase === "claim" ? true : false}
        setAmount={setAmount}
        handleMint={mint}
        soldOut={totalSupply >= COLLECTION_DISTRIBUTION.totalSupply}
      />
    );
  };

  return (
    <div className="flex justify-center flex-col">
      <div className="mb-1">
        {assets?.length > 0 && (
          <div className="text-white text-xs text-center justify-center">
            <span className="font-kiona-bold lg:text-xl text-sm">
              REFLECTIONS{" "}
              <span className="font-kiona-light lg:text-lg text-xs ml-1">
                <span className="text-blend-pink">#{tokenIds[slideIndex]}</span>
              </span>
            </span>
          </div>
        )}
      </div>
      <motion.div
        variants={mainBox}
        initial="hidden"
        animate="visible"
        className="w-full h-full flex justify-center items-center"
      >
        <div className="mx-0 md:mx-auto">
          <div
            className={`w-[350px] md:w-[600px] h-[400px] 5xl:w-[800px] 5xl:h-[600px] ${styles.box}`}
          >
            <div className="absolute top-0 left-0 z-[1000]">
              <TopEdgeBorder />
            </div>
            <div className="absolute bottom-0 right-0 z-[1000]">
              <BottomEdgeBorder />
            </div>

            <motion.div
              variants={mainComponent}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              {renderMainComponent()}
            </motion.div>
          </div>
        </div>
      </motion.div>
      <div className="mt-1">
        {assets?.length > 0 && (
          <div className="text-white text-xs text-center justify-center">
            <div className="flex justify-center items-center mt-2">
              <div className="w-full flex justify-center text-center relative">
                <div className="mr-2">
                  <SocialButton
                    href={`https://opensea.io/assets/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/${tokenIds[slideIndex]}`}
                  >
                    <OpenSea />
                  </SocialButton>
                </div>
                <div className="mr-2">
                  <SocialButton
                    href={`https://looksrare.org/collections/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/${tokenIds[slideIndex]}`}
                  >
                    <LooksRare />
                  </SocialButton>
                </div>
                {userCanMintCount > 0 && (
                  <div className="absolute right-0">
                    <Button
                      className="py-2 px-8 text-sm bg-[#191b23] text-white"
                      label="Mint"
                      onClick={mint}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
