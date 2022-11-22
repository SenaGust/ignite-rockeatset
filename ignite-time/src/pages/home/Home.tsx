import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./Home.styles";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { createContext, useState } from "react";
import { Countdown } from "./components/countdown/Countdown";
import { NewCycleForm } from "./components/newCycleForm/newCycleForm";

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

interface CyclesContextData {
  activeCycle?: Cycle;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  finishActiveCycle: () => void;
  increaseAmountSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextData);

export function Home() {
  const [cycles, setCycles] = useState<Array<Cycle>>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function increaseAmountSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function finishActiveCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      countdownInMinutes: 0,
      task: "",
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

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

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            finishActiveCycle,
            amountSecondsPassed,
            increaseAmountSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>

          <Countdown />
        </CyclesContext.Provider>

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
