import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "../auth/[...nextauth].api";
import { z } from "zod";

interface Error {
  message: string;
}

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    })
  ),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | Error>
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  if (!session) {
    return res.status(401).end();
  }

  const { intervals } = timeIntervalsBodySchema.parse(req.body);

  await Promise.all(
    intervals.map(({ weekDay, startTimeInMinutes, endTimeInMinutes }) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: weekDay,
          time_start_in_minutes: startTimeInMinutes,
          time_end_in_minutes: endTimeInMinutes,
          user_id: session.user.id,
        },
      });
    })
  );

  return res.status(201).end();
}
