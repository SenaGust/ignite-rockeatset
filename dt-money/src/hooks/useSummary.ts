import { TransactionContext } from "../contexts/TransactionContext";
import { useContextSelector } from "use-context-selector";
import { useMemo } from "react";

export function useSummary() {
  const transactions = useContextSelector(
    TransactionContext,
    ({ transactions }) => transactions
  );

  const totalIncome = useMemo(
    () =>
      transactions
        .filter(({ type }) => type === "income")
        .reduce((total, { price }) => total + price, 0),
    [transactions]
  );

  const totalOutcome = useMemo(
    () =>
      transactions
        .filter(({ type }) => type === "outcome")
        .reduce((previousTotal, { price }) => previousTotal + price, 0),
    [transactions]
  );

  return { totalIncome, totalOutcome, total: totalIncome - totalOutcome };
}
