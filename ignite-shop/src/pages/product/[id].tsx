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

interface ProductProps {
  product: ProductType;
}

export default function Product({
  product: { name, price, imageUrl, description },
}: ProductProps) {
  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={imageUrl} width={520} height={480} alt={name} />
      </ImageContainer>

      <ProductDetails>
        <h1>{name}</h1>
        <span>{price}</span>

        <p>{description}</p>

        <button>Buy now</button>
      </ProductDetails>
    </ProductContainer>
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
