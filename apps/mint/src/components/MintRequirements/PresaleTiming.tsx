import { useMintPeriod } from "@hooks/contractsRead";
import { formatTime, useCountDown } from "@hooks/useCountDown";
import dayjs from "dayjs";

import { Container } from "./Container";
import { RequirementStatus } from "./RequirementStatus";

export const PresaleTiming = () => {
  const { presaleTime, publicTime, mintPhase } = useMintPeriod();
  const presaleCountDown = useCountDown(dayjs.unix(presaleTime).toDate());
  const publicSaleCountDown = useCountDown(dayjs.unix(publicTime).toDate());

  if (mintPhase === "none") {
    const timer = `${formatTime(presaleCountDown[1])}:${formatTime(
      presaleCountDown[2]
    )}:${formatTime(presaleCountDown[3])}`;
    return (
      <Container>
        <RequirementStatus />
        <span>
          Presale start in <strong>{timer}</strong>
        </span>
      </Container>
    );
  }

  const timer = `${formatTime(publicSaleCountDown[1])}:${formatTime(
    publicSaleCountDown[2]
  )}:${formatTime(publicSaleCountDown[3])}`;
  return (
    <Container>
      <RequirementStatus passed />
      <span>
        Time remaining in <strong>{`Presale is ${timer}`}</strong>
      </span>
    </Container>
  );
};
