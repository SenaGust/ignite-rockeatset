import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const username = String(req.query.username);
  const { date } = req.query;

  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user) {
    return res.status(401).json({ message: "User does NOT exist" });
  }

  const referenceDate = dayjs(String(date));
  const isPastDate = referenceDate.endOf("day").isBefore(new Date());

  if (isPastDate) {
    return res.status(200).json({ availableTimes: [], possibleTimes: [] });
  }

  const userTimeInterval = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get("day"),
    },
  });

  if (!userTimeInterval) {
    return res.status(200).json({ availableTimes: [], possibleTimes: [] });
  }

  const startHour = userTimeInterval.time_start_in_minutes / 60;
  const endHour = userTimeInterval.time_end_in_minutes / 60;

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i;
    }
  );

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set("hour", startHour).toDate(),
        lte: referenceDate.set("hour", endHour).toDate(),
      },
    },
  });

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time
    );

    const isTimeInPast = referenceDate.set("hour", time).isBefore(new Date());

    return !isTimeBlocked && !isTimeInPast;
  });

  return res.status(200).json({ availableTimes, possibleTimes });
}
