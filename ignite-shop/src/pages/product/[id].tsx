import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from "../../styles/pages/product";
import { GetStaticProps, GetStaticPaths } from "next";
import { ProductType } from "@/src/types/Product";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import Head from "next/head";

interface ProductProps {
  product: ProductType;
}

export default function Product({
  product: { name, price, imageUrl, description, defaultPriceId },
}: ProductProps) {
  const [isBuying, setIsBuying] = useState(false);

  const handleBuyProduct = async () => {
    try {
      setIsBuying(true);
      const {
        data: { checkoutUrl },
      } = await axios.post<{ checkoutUrl: string }>("/api/checkout", {
        priceId: defaultPriceId,
      });

      window.location.href = checkoutUrl;
    } catch (err) {
      setIsBuying(false);
      console.error("Error: ", err);
    }
  };

  return (
    <>
      <Head>
        <title>{name} | Ignite Shop</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image src={imageUrl} width={520} height={480} alt={name} />
        </ImageContainer>

        <ProductDetails>
          <h1>{name}</h1>
          <span>{price}</span>

          <p>{description}</p>

          <button disabled={isBuying} onClick={handleBuyProduct}>
            Buy now
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [{ params: { id: "" } }], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  {
    product: ProductType;
  },
  { id: string }
> = async ({ params }) => {
  const productId = params!.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });

  return {
    props: {
      product: {
        id: product.id,
        imageUrl: product.images[0],
        name: product.name,
        description: product.description || "",
        defaultPriceId: (product.default_price as Stripe.Price).id,
        price: new Intl.NumberFormat("pt-br", {
          style: "currency",
          currency: "BRL",
        }).format(
          ((product.default_price as Stripe.Price).unit_amount || 0) / 100
        ),
      },
    },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
