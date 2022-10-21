import { useMintPeriod, useTotalMinted } from "@hooks/contractsRead";
import { formatTime, useCountDown } from "@hooks/useCountDown";
import { useGetProjectDetail } from "@hooks/useGetProjectDetail";
import dayjs from "dayjs";

export const PublicSaleCountdown = () => {
  const totalMinted = useTotalMinted();
  const { data } = useGetProjectDetail("rlxyz");
  const { publicTime } = useMintPeriod();
  const countdown = useCountDown(dayjs.unix(publicTime).toDate());

  const timer = `${formatTime(countdown[1])}:${formatTime(
    countdown[2]
  )}:${formatTime(countdown[3])}`;

  return (
    <div className="flex justify-between">
      <span>{`Presale (${totalMinted}/${data?.totalSupply} Minted)`}</span>
      <span>{timer}</span>
    </div>
  );
};
