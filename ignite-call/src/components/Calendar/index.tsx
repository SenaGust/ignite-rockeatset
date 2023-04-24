import { CaretLeft, CaretRight } from "phosphor-react";
import { getWeekDays } from "@/utils/get-week-days";
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from "./styles";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { chunkArray } from "@/utils/chunk-array";

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs().set("date", 1));

  const handlePreviousMonth = () => {
    setCurrentDate((state) => state.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate((state) => state.add(1, "month"));
  };

  const shortWeekDays = getWeekDays({ short: true });
  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");

  const calendarWeeks = useMemo(() => {
    const firstWeekDayInCurrentMonth = currentDate.get("day");
    const previousMonthDays = Array.from({
      length: firstWeekDayInCurrentMonth,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, "day");
      })
      .map((date) => ({ date, disabled: true }))
      .reverse();

    const daysInMonth = Array.from({
      length: currentDate.daysInMonth(),
    })
      .map((_, i) => {
        return currentDate.set("date", i + 1);
      })
      .map((date) => ({
        date,
        disabled: date.endOf("day").isBefore(new Date()),
      }));

    const lastDayInCurrentMonth = currentDate.set(
      "date",
      currentDate.daysInMonth()
    );
    const endWeekDayInCurrentMonth = lastDayInCurrentMonth.get("day");
    const nextMonthDays = Array.from({
      length: 7 - (endWeekDayInCurrentMonth + 1),
    })
      .map((_, i) => {
        return lastDayInCurrentMonth.add(i + 1, "day");
      })
      .map((date) => ({
        date,
        disabled: true,
      }));

    return chunkArray(
      [...previousMonthDays, ...daysInMonth, ...nextMonthDays],
      7
    );
  }, [currentDate]);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>
        <CalendarActions>
          <button
            type="button"
            onClick={handlePreviousMonth}
            title="Mudar para o mês anterior"
          >
            <CaretLeft />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            title="Mudar para o próximo mês"
          >
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map((week, i) => (
            <tr key={i}>
              {week.map(({ date, disabled }) => (
                <td key={date.toISOString()}>
                  <CalendarDay disabled={disabled}>
                    {date.get("date")}
                  </CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
}
