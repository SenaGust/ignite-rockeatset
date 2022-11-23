import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./Home.styles";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useContext } from "react";
import { Countdown } from "./components/countdown/Countdown";
import { NewCycleForm } from "./components/newCycleForm/newCycleForm";
import { CyclesContext } from "../../contexts/CyclesContextProvider";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "task name should have more than 1 character"),
  countdownInMinutes: zod
    .number()
    .min(1)
    .max(60, "the countdown should have less than 60 minutes"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { createNewCycle, interruptActiveCycle, activeCycle } =
    useContext(CyclesContext);

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
    console.log(data);
    createNewCycle(data);
    reset();
  }

  function handleStopCycle() {
    interruptActiveCycle();
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

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
