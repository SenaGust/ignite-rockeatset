import {
  ArrowCircleUp,
  ArrowCircleDown,
  CurrencyCircleDollar,
} from "phosphor-react";
import { SummaryContainer, SummaryCard } from "./Summary.styles";

export function Summary() {
  return (
    <SummaryContainer>
      <SummaryCard>
        <header>
          <span>Incoming</span>
          <ArrowCircleUp size="32" color="#00b37e" />
        </header>
        <strong>$ 17.400,00</strong>
      </SummaryCard>

      <SummaryCard>
        <header>
          <span>Outgoing</span>
          <ArrowCircleDown size="32" color="#f75a68" />
        </header>
        <strong>$ 17.400,00</strong>
      </SummaryCard>

      <SummaryCard variant="green">
        <header>
          <span>Total</span>
          <CurrencyCircleDollar size="32" color="#fff" />
        </header>
        <strong>$ 17.400,00</strong>
      </SummaryCard>
    </SummaryContainer>
  );
}
