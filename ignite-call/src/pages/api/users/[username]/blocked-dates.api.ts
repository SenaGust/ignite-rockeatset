import { prisma } from "@/lib/prisma";
import dayjs, { Dayjs } from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const username = String(req.query.username);

  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user) {
    return res.status(401).json({ message: "User does NOT exist" });
  }

  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ message: "Year and month are required" });
  }

  const userTimeInterval = await prisma.userTimeInterval.findMany({
    where: {
      user_id: user.id,
    },
  });

  const blockedWeekDays = Array.from({ length: 7 })
    .map((_, i) => i)
    .filter(
      (weekday) =>
        !userTimeInterval.some(({ week_day }) => weekday === week_day)
    );

  const currentDate = dayjs()
    .set("month", Number(month))
    .set("year", Number(year));

  const daysInMonth = Array.from({
    length: currentDate.daysInMonth(),
  })
    .map((_, i) => {
      return currentDate.set("date", i + 1);
    })
    .filter((day) => !blockedWeekDays.includes(day.get("day")));

  const blockedMonthDays = (
    await Promise.all(
      daysInMonth.map(async (day) => {
        const userTimeInterval = await prisma.userTimeInterval.findFirstOrThrow(
          {
            where: {
              user_id: user.id,
              week_day: day.get("day"),
            },
          }
        );

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
              gte: day.set("hour", startHour).toDate(),
              lte: day.set("hour", endHour).toDate(),
            },
          },
        });

        const isAvailable = possibleTimes.every((time) =>
          blockedTimes.some(
            (blockedTime) => blockedTime.date.getHours() === time
          )
        );

        return {
          day,
          isAvailable,
        };
      })
    )
  )
    .filter(({ isAvailable }) => isAvailable)
    .map(({ day }) => day.get("date"));

  return res.status(200).json({
    blockedMonthDays: blockedMonthDays,
    blockedWeekDays,
  });
}
