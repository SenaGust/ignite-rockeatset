import { HeaderContainer } from "./Header.styles";

export function Header() {
  return (<HeaderContainer>
      <nav> 
        <a href="/">
            timer
        </a> 
        <a href="/history">
            HISTORY
        </a> 
        </nav>
    </HeaderContainer>);
}
