import Image from "next/image";
import { Container, Product } from "../styles/pages/home";
import Tshit1 from "../assets/tshirts/1.png";
import Tshit2 from "../assets/tshirts/2.png";
import Tshit3 from "../assets/tshirts/3.png";

export default function Home() {
  return (
    <Container>
      <Product>
        <Image src={Tshit1} alt="first tshirt" width={520} height={480} />
        <footer>
          <strong>T-shirt 1</strong>
          <span>R$ 79,80</span>
        </footer>
      </Product>

      <Product>
        <Image src={Tshit2} alt="first tshirt" width={520} height={480} />
        <footer>
          <strong>T-shirt 2</strong>
          <span>R$ 78,80</span>
        </footer>
      </Product>

      <Product>
        <Image src={Tshit3} alt="first tshirt" width={520} height={480} />
        <footer>
          <strong>T-shirt 3</strong>
          <span>R$ 77,80</span>
        </footer>
      </Product>
    </Container>
  );
}
