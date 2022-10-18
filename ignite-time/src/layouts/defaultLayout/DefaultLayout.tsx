import { Outlet } from "react-router";
import { Header } from "../../components/header/Header";
import { LayoutContainer } from "./DefaultLayout.styles";

export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />
      <Outlet />
    </LayoutContainer>
  );
}
