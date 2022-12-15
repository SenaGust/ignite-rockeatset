import {
  ArrowCircleUp,
  ArrowCircleDown,
  CurrencyCircleDollar,
} from 'phosphor-react'
import { SummaryContainer, SummaryCard } from './Summary.styles'
import { priceFormatter } from '../../../../utils/formatters'
import { useSummary } from '../../../../hooks/useSummary'

export function Summary() {
  const { totalIncome, totalOutcome, total } = useSummary()

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
        <strong>{priceFormatter.format(total)}</strong>
      </SummaryCard>
    </SummaryContainer>
  )
}
