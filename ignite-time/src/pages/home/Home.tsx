import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import {
  CountDownContainer,
  CountdownInput,
  CountDownSeparator,
  FormContainer,
  HomeContainer,
  StartCountdownButton,
  TaskInput,
} from "./Home.styles";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "task name should have more than 1 character"),
  countdownInMinutes: zod
    .number()
    .min(5)
    .max(60, "the countdown should have less than 60 minutes"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  countdownInMinutes: number;
  startDate: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Array<Cycle>>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const countDownInSeconds = (activeCycle?.countdownInMinutes || 0) * 60;
  const currentSeconds = activeCycle
    ? countDownInSeconds - amountSecondsPassed
    : 0;
  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutesFormatted = String(minutesAmount).padStart(2, "0");
  const secondsFormatted = String(secondsAmount).padStart(2, "0");

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      countdownInMinutes: 0,
      task: "",
    },
  });

  const hasTask = Boolean(watch("task"));
  const isSubmitDisabled = !hasTask;

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
      id,
      task: data.task,
      countdownInMinutes: data.countdownInMinutes,
      startDate: new Date(),
    };

    setAmountSecondsPassed(0);
    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    reset();
  }

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate)
        );
      }, 1);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutesFormatted}:${secondsFormatted}`;
    }
  }, [minutesFormatted, secondsFormatted]);

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">I will work with </label>
          <TaskInput
            id="task"
            placeholder="task name"
            list="task-suggestions"
            required
            {...register("task")}
          />

          <datalist id="task-suggestions">
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
          </datalist>

          <label htmlFor="countdownInMinutes">in </label>
          <CountdownInput
            id="countdownInMinutes"
            type="number"
            placeholder="00"
            step="5"
            min="0"
            max="60"
            {...register("countdownInMinutes", { valueAsNumber: true })}
          />

          <span>minutes.</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutesFormatted[0]}</span>
          <span>{minutesFormatted[1]}</span>
          <CountDownSeparator>:</CountDownSeparator>
          <span>{secondsFormatted[0]}</span>
          <span>{secondsFormatted[1]}</span>
        </CountDownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play />
          Start
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
