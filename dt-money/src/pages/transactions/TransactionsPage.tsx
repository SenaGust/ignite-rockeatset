import { useContextSelector } from "use-context-selector";
import { Header } from "../../components/header/Header";
import { TransactionContext } from "../../contexts/TransactionContext";
import { dateFormatter, priceFormatter } from "../../utils/formatters";
import { SearchForm } from "./components/searchForm/SearchForm";
import { Summary } from "./components/summary/Summary";
import {
  TransactionsContainer,
  TransactionsTable,
  PriceHighlight,
} from "./TransactionsPage.styles";

export function TransactionsPage() {
  const transactions = useContextSelector(
    TransactionContext,
    ({ transactions }) => transactions
  );
  return (
    <div>
      <Header />
      <Summary />
      <TransactionsContainer>
        <SearchForm />
        <TransactionsTable>
          <tbody>
            {transactions.map(
              ({ category, id, createdAt, type, description, price }) => (
                <tr key={id}>
                  <td width="40%">{description}</td>
                  <td>
                    <PriceHighlight variant={type}>
                      {type === "outcome" && "- "}
                      {priceFormatter.format(price)}
                    </PriceHighlight>
                  </td>
                  <td>{category}</td>
                  <td>{dateFormatter.format(new Date(createdAt))}</td>
                </tr>
              )
            )}
          </tbody>
        </TransactionsTable>
      </TransactionsContainer>
    </div>
  );
}
