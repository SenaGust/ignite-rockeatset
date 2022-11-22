import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import {
  CountDownContainer,
  CountdownInput,
  CountDownSeparator,
  FormContainer,
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
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
    .min(1)
    .max(60, "the countdown should have less than 60 minutes"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  countdownInMinutes: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
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

  function handleStopCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        }

        return cycle;
      })
    );
    setActiveCycleId(null);
  }

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (secondsDifference >= countDownInSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() };
              } else {
                return cycle;
              }
            })
          );
          setAmountSecondsPassed(countDownInSeconds);
          setActiveCycleId(null);
          clearInterval(interval);
        } else {
          setAmountSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, countDownInSeconds, activeCycleId]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutesFormatted}:${secondsFormatted}`;
    }
  }, [minutesFormatted, secondsFormatted, activeCycle]);

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">I will work with </label>
          <TaskInput
            id="task"
            placeholder="task name"
            list="task-suggestions"
            disabled={!!activeCycle}
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
            disabled={!!activeCycle}
            placeholder="00"
            step={1}
            min={1}
            max={60}
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

        {Boolean(activeCycle) && (
          <StopCountdownButton type="button" onClick={handleStopCycle}>
            <HandPalm size={24} />
            Stop
          </StopCountdownButton>
        )}

        {!activeCycle && (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Start
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
