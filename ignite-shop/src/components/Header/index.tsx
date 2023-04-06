import logoImg from "../../assets/logo.svg";
import Image from "next/image";
import { Container } from "./styles";

export default function Header() {
  return (
    <Container>
      <Image src={logoImg} alt="logo" />
    </Container>
  );
}
