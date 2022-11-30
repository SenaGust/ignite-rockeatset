import {
  NewTransactionButton,
  HeaderContainer,
  HeaderContent,
} from "./Header.styles";
import logoImg from "../../assets/logo-ignite.svg";

export function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <img src={logoImg} alt="" />

        <NewTransactionButton> New transaction</NewTransactionButton>
      </HeaderContent>
    </HeaderContainer>
  );
}
