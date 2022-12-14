import { ReactNode, useCallback, useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";

interface Transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
  createdAt: string;
}

interface CreateTransaction {
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction: (transaction: CreateTransaction) => Promise<void>;
}

interface TransactionContextProviderProps {
  children: ReactNode;
}

export const TransactionContext = createContext({} as TransactionContextType);

export function TransactionContextProvider({
  children,
}: TransactionContextProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(async (query?: string) => {
    const { data } = await api.get("/transactions", {
      params: {
        _sort: "createdAt",
        _order: "desc",
        q: query,
      },
    });
    setTransactions(data);
  }, []);

  const createTransaction = useCallback(
    async ({ category, description, price, type }: CreateTransaction) => {
      const { data: createdTransaction } = await api.post<Transaction>(
        "transactions",
        {
          category,
          description,
          price,
          type,
          createdAt: new Date().toISOString(),
        }
      );

      setTransactions((transactions) => [...transactions, createdTransaction]);
    },
    []
  );

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
