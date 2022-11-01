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

export function Home() {
  const { register, handleSubmit, watch } = useForm();
  const hasTask = Boolean(watch("task"));
  const isSubmitDisabled = !hasTask;

  function handleCreateNewCycle(data: any) {
    console.log(data);
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
