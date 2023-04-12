import Image from "next/image";
import { Container, Product } from "../styles/pages/home";
import { useKeenSlider } from "keen-slider/react";
import Stripe from "stripe";
import "keen-slider/keen-slider.min.css";
import { stripe } from "@/lib/stripe";
import { GetStaticProps } from "next";
import Link from "next/link";
import { ProductType } from "../types/Product";

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
        <Link href={`/product/${id}`} key={id}>
          <Product className="keen-slider__slide">
            <Image src={imageUrl} width={520} height={480} alt={name} />

            <footer>
              <strong>{name}</strong>
              <span>{price}</span>
            </footer>
          </Product>
        </Link>
      ))}
    </Container>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = response.data.map(
    ({ id, name, images: [imageUrl], default_price: price }): ProductType => ({
      id,
      imageUrl,
      name,
      price: new Intl.NumberFormat("pt-br", {
        style: "currency",
        currency: "BRL",
      }).format(((price as Stripe.Price).unit_amount || 0) / 100),
    })
  );

  return {
    props: { products },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
