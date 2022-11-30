import differenceInSeconds from "date-fns/differenceInSeconds";
import {
  useState,
  createContext,
  ReactNode,
  useReducer,
  useEffect,
} from "react";
import { Cycle } from "../@types/Cycle";
import {
  finishActiveCycleAction,
  interruptActiveCycleAction,
  addNewCycleAction,
} from "../reducers/cycles/actions";
import { cyclesReducer } from "../reducers/cycles/reducer";

interface CyclesContextProviderProps {
  children?: ReactNode;
}

interface CreateNewCycleData {
  task: string;
  countdownInMinutes: number;
}

interface CyclesContextData {
  cycles: Array<Cycle>;
  activeCycle?: Cycle;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  finishActiveCycle: () => void;
  interruptActiveCycle: () => void;
  increaseAmountSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateNewCycleData) => void;
}

export const CyclesContext = createContext({} as CyclesContextData);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const initialState = {
    cycles: [],
    activeCycleId: null,
  };
  function getCycleStateFromLocalStorage() {
    const storedCyclesStateAsJSON = localStorage.getItem(
      "@ignite-timer:cycles-state-1.0.0"
    );

    if (storedCyclesStateAsJSON) {
      return JSON.parse(storedCyclesStateAsJSON);
    }

    return initialState;
  }

  const [{ cycles, activeCycleId }, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    getCycleStateFromLocalStorage
  );

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }

    return 0;
  });

  useEffect(() => {
    const stateJSON = JSON.stringify({ cycles, activeCycleId });

    localStorage.setItem("@ignite-timer:cycles-state-1.0.0", stateJSON);
  }, [cycles, activeCycleId]);

  function createNewCycle(data: CreateNewCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      countdownInMinutes: data.countdownInMinutes,
      startDate: new Date(),
    };

    setAmountSecondsPassed(0);
    dispatch(addNewCycleAction(newCycle));
  }

  function interruptActiveCycle() {
    dispatch(interruptActiveCycleAction());
  }

  function finishActiveCycle() {
    dispatch(finishActiveCycleAction());
  }

  function increaseAmountSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        finishActiveCycle,
        increaseAmountSecondsPassed,
        interruptActiveCycle,
        createNewCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
