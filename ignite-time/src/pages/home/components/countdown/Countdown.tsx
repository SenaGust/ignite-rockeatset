import { CountDownContainer, CountDownSeparator } from "./Countdown.styles";
import { useContext, useEffect } from "react";
import { CyclesContext } from "../../Home";
import { differenceInSeconds } from "date-fns";

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    finishActiveCycle,
    amountSecondsPassed,
    increaseAmountSecondsPassed,
  } = useContext(CyclesContext);

  const countDownInSeconds = (activeCycle?.countdownInMinutes || 0) * 60;
  const currentSeconds = activeCycle
    ? countDownInSeconds - amountSecondsPassed
    : 0;
  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutesFormatted = String(minutesAmount).padStart(2, "0");
  const secondsFormatted = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (secondsDifference >= countDownInSeconds) {
          finishActiveCycle();
          increaseAmountSecondsPassed(countDownInSeconds);
          clearInterval(interval);
        } else {
          increaseAmountSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [
    activeCycle,
    countDownInSeconds,
    activeCycleId,
    finishActiveCycle,
    increaseAmountSecondsPassed,
  ]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutesFormatted}:${secondsFormatted}`;
    }
  }, [minutesFormatted, secondsFormatted, activeCycle]);

  return (
    <CountDownContainer>
      <span>{minutesFormatted[0]}</span>
      <span>{minutesFormatted[1]}</span>
      <CountDownSeparator>:</CountDownSeparator>
      <span>{secondsFormatted[0]}</span>
      <span>{secondsFormatted[1]}</span>
    </CountDownContainer>
  );
}
