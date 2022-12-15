import { useContext, useEffect, useState } from "react";
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

interface Transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
  createdAt: string;
}

export function TransactionsPage() {
  const { transactions } = useContext(TransactionContext);

  return (
    <div>
      <Header />
      <Summary />
      <TransactionsContainer>
        <SearchForm />
        <TransactionsTable>
          <tbody>
            {transactions.map(
              ({ category, createdAt, type, description, price }) => (
                <tr>
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
