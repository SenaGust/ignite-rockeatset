import { Play } from "phosphor-react";
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
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">I will work with </label>
          <TaskInput
            id="task"
            placeholder="task name"
            list="task-suggestions"
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
            min="5"
            max="60"
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

        <StartCountdownButton type="submit">
          <Play />
          Start
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
