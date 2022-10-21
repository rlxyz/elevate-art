import {
  PresaleRequirements,
  PublicSaleRequirements,
} from "@components/MintRequirements";
import { Accordion } from "@components/UI/Accordion";
import { useMintPeriod } from "@hooks/contractsRead";

export const Requirements = () => {
  const { mintPhase } = useMintPeriod();

  if (mintPhase === "none") {
    return null;
  }

  if (mintPhase === "presale") {
    return (
      <Accordion label="Presale Requirements">
        <PresaleRequirements />
      </Accordion>
    );
  }

  return (
    <Accordion label="Public Sale Requirements">
      <PublicSaleRequirements />
    </Accordion>
  );
};
