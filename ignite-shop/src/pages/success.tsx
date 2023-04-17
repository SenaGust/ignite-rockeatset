import { ImageContainer, SuccessContainer } from "../styles/pages/success";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { ProductType } from "../types/Product";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import Image from "next/image";
import Head from "next/head";

interface SuccessProps {
  costumerName: string;
  product: ProductType;
}

export default function Success({
  costumerName,
  product: { name, imageUrl },
}: SuccessProps) {
  return (
    <>
      <Head>
        <title>Purchase made | Ignite shop</title>
        <meta name="robots" content="noindex" />
      </Head>

      <SuccessContainer>
        <h1>Purchase made</h1>

        <ImageContainer>
          <Image src={imageUrl} width={120} height={110} alt={name} />
        </ImageContainer>

        <p>
          Uhuul, <strong>{costumerName}</strong>! Your <strong>{name}</strong>{" "}
          is already on its way home.
        </p>

        <Link href="/">back to home</Link>
      </SuccessContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const sessionId = String(query.session_id);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  const costumerName = session.customer_details!.name;
  const product = session.line_items!.data[0].price!.product as Stripe.Product;

  return {
    props: {
      costumerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      },
    },
  };
};
