import {
  CountdownInput,
  FormContainer,
  TaskInput,
} from "./newCycleForm.styles";
import { CyclesContext } from "../../../../layouts/CyclesContextProvider";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
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
  );
}
