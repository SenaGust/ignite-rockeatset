import { useState } from "react";
import { CalendarStep } from "../CalendarStep";
import { ConfirmStep } from "../ConfirmStep";

export function ScheduleForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (selectedDate) {
    return (
      <ConfirmStep
        schedulingDate={selectedDate}
        onCancel={() => setSelectedDate(null)}
      />
    );
  }

  return <CalendarStep onSelectDateTime={setSelectedDate} />;
}
