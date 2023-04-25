import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "../../auth/[...nextauth].api";
import { z } from "zod";
import dayjs from "dayjs";

const CreateScheduleSchema = z.object({
  name: z.string(),
  observations: z.string(),
  email: z.string().email(),
  date: z.string().datetime(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const username = String(req.query.username);

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User does not exist." });
  }

  const { name, observations, email, date } = CreateScheduleSchema.parse(
    req.body
  );

  const schedulingDate = dayjs(date).startOf("hour");

  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).end();
  }

  const hasConflict = await prisma.scheduling.findFirst({
    where: { user_id: user.id, date: schedulingDate.toDate() },
  });

  if (hasConflict) {
    return res.status(403).end();
  }

  await prisma.scheduling.create({
    data: {
      date: schedulingDate.toDate(),
      email,
      name,
      observations,
      user_id: user.id,
    },
  });

  return res.status(201).end();
}
