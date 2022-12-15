import {
  ArrowCircleUp,
  ArrowCircleDown,
  CurrencyCircleDollar,
} from "phosphor-react";
import { useContext } from "react";
import { TransactionContext } from "../../../../contexts/TransactionContext";
import { SummaryContainer, SummaryCard } from "./Summary.styles";
import { priceFormatter } from "../../../../utils/formatters";

export function Summary() {
  const { transactions } = useContext(TransactionContext);

  const totalIncome = transactions
    .filter(({ type }) => type === "income")
    .reduce((total, { price }) => total + price, 0);

  const totalOutcome = transactions
    .filter(({ type }) => type === "outcome")
    .reduce((previousTotal, { price }) => previousTotal + price, 0);

  return (
    <SummaryContainer>
      <SummaryCard>
        <header>
          <span>Incoming</span>
          <ArrowCircleUp size="32" color="#00b37e" />
        </header>
        <strong>{priceFormatter.format(totalIncome)} </strong>
      </SummaryCard>

      <SummaryCard>
        <header>
          <span>Outcome</span>
          <ArrowCircleDown size="32" color="#f75a68" />
        </header>
        <strong>{priceFormatter.format(totalOutcome)}</strong>
      </SummaryCard>

      <SummaryCard variant="green">
        <header>
          <span>Total</span>
          <CurrencyCircleDollar size="32" color="#fff" />
        </header>
        <strong>{priceFormatter.format(totalIncome - totalOutcome)}</strong>
      </SummaryCard>
    </SummaryContainer>
  );
}
