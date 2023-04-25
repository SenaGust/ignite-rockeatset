import dayjs from "dayjs";
import { Calendar } from "@/components/Calendar";
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from "./styles";
import { useState } from "react";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

interface Availability {
  possibleTimes: number[];
  availableTimes: number[];
}

interface BlockedDays {
  blockedMonthDays: number[];
  blockedWeekDays: number[];
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void;
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [currentDate, setCurrentDate] = useState(dayjs().set("date", 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();
  const hasDaySelected = Boolean(selectedDate);
  const username = String(router.query.username);

  const selectedDateWithoutTime = hasDaySelected
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : null;

  const { data: availability } = useQuery<Availability>(
    ["availability", selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      });

      return response.data;
    },
    {
      enabled: Boolean(selectedDate),
    }
  );

  const { data: blockedDays, isLoading } = useQuery<BlockedDays>(
    ["blocked-days", selectedDate],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          month: currentDate.get("month"),
          year: currentDate.get("year"),
        },
      });

      return response.data;
    }
  );

  const weekDay = hasDaySelected ? dayjs(selectedDate).format("dddd") : null;
  const describedDate = hasDaySelected
    ? dayjs(selectedDate).format("DD[ de ]MMMM")
    : null;

  const handleSelectTime = (hour: number) => {
    const datetime = dayjs(selectedDate)
      .set("hour", hour)
      .startOf("hour")
      .toDate();

    onSelectDateTime(datetime);
  };

  return (
    <Container isTimePickerOpen={hasDaySelected}>
      {!isLoading && blockedDays && (
        <Calendar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          blockedMonthDays={blockedDays.blockedMonthDays}
          blockedWeekDays={blockedDays.blockedWeekDays}
          onSelectDate={setSelectedDate}
        />
      )}

      {hasDaySelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                <TimePickerItem
                  key={hour}
                  disabled={!availability.availableTimes.includes(hour)}
                  onClick={() => handleSelectTime(hour)}
                >
                  {String(hour).padStart(2, "0")}:00h
                </TimePickerItem>
              );
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  );
}
