import { TransactionContext } from "../contexts/TransactionContext";
import { useContextSelector } from "use-context-selector";

export function useSummary() {
  const transactions = useContextSelector(
    TransactionContext,
    ({ transactions }) => transactions
  );

  const totalIncome = transactions
    .filter(({ type }) => type === "income")
    .reduce((total, { price }) => total + price, 0);

  const totalOutcome = transactions
    .filter(({ type }) => type === "outcome")
    .reduce((previousTotal, { price }) => previousTotal + price, 0);

  return { totalIncome, totalOutcome, total: totalIncome - totalOutcome };
}
