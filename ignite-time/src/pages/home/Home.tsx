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

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "task name should have more than 1 character"),
  countdownInMinutes: zod
    .number()
    .min(5)
    .max(60, "the countdown should have less than 60 minutes"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      countdownInMinutes: 0,
      task: "",
    },
  });
  const hasTask = Boolean(watch("task"));
  const isSubmitDisabled = !hasTask;

  function handleCreateNewCycle(data: any) {
    console.log(data);
    reset();
  }

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
          <span>0</span>
          <span>0</span>
          <CountDownSeparator>:</CountDownSeparator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play />
          Start
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
