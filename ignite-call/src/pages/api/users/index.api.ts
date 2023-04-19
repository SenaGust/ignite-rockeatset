import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";
type UserData = {
  username: string;
  name: string;
};

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserData | Error>
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username, name }: UserData = req.body;

  const isUserExists = await prisma.user.findUnique({ where: { username } });

  if (isUserExists) {
    return res.status(400).json({ message: "Username already exists." });
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  });

  setCookie({ res }, "@ignite-call:userId", user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return res.status(201).json(user);
}
