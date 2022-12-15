import * as Dialog from '@radix-ui/react-dialog'
import {
  NewTransactionButton,
  HeaderContainer,
  HeaderContent,
} from './Header.styles'
import logoImg from '../../assets/logo-ignite.svg'
import { NewTransactionModal } from '../newTransactionModal/NewTransactionModal'

export function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <img src={logoImg} alt="" />

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <NewTransactionButton> New transaction</NewTransactionButton>
          </Dialog.Trigger>

          <NewTransactionModal />
        </Dialog.Root>
      </HeaderContent>
    </HeaderContainer>
  )
}
