import Image from "next/image";
import { Container, Product } from "../styles/pages/home";
import Tshit1 from "../assets/tshirts/1.png";
import Tshit2 from "../assets/tshirts/2.png";
import Tshit3 from "../assets/tshirts/3.png";
import { useKeenSlider } from "keen-slider/react";
import Stripe from "stripe";
import "keen-slider/keen-slider.min.css";
import { stripe } from "@/lib/stripe";
import { GetServerSideProps } from "next";

interface ProductType {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

interface HomeProps {
  products: ProductType[];
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <Container ref={sliderRef} className="keen-slider">
      {products.map(({ id, imageUrl, name, price }) => (
        <Product className="keen-slider__slide" key={id}>
          <Image src={imageUrl} width={520} height={480} alt={name} />

          <footer>
            <strong>{name}</strong>
            <span>R$ {price}</span>
          </footer>
        </Product>
      ))}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = response.data.map(
    ({ id, name, images: [imageUrl], default_price: price }): ProductType => ({
      id,
      imageUrl,
      name,
      price: ((price as Stripe.Price).unit_amount || 0) / 100,
    })
  );

  return { props: { products } };
};
