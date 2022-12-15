import { ThemeProvider } from 'styled-components'
import { TransactionContextProvider } from './contexts/TransactionContext'
import { TransactionsPage } from './pages/transactions/TransactionsPage'
import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <TransactionContextProvider>
        <TransactionsPage />
      </TransactionContextProvider>
    </ThemeProvider>
  )
}
