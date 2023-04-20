import { Avatar, Heading, Text } from "@ignite-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { prisma } from "@/lib/prisma";
import { Container, UserHeader } from "./styles";
import { ScheduleForm } from "./components/ScheduleForm";
import { ConfirmStep } from "./components/ConfirmStep";

interface ScheduleProps {
  user: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
}

export default function Schedule({
  user: { name, bio, avatarUrl },
}: ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={avatarUrl} />
        <Heading>{name}</Heading>
        <Text>{bio}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username);

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: { name: user.name, avatarUrl: user.avatar_url, bio: user.bio },
    },
    revalidate: 60 * 60 * 1, // 1 hour
  };
};
