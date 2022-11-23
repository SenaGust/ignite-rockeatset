import { useState, createContext, ReactNode, useReducer } from "react";
import { Cycle } from "../@types/Cycle";

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

interface CyclesState {
  cycles: Array<Cycle>;
  activeCycleId?: string | null;
}

export const CyclesContext = createContext({} as CyclesContextData);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [{ cycles, activeCycleId }, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      switch (action.type) {
        case "ADD_NEW_CYCLE":
          return {
            cycles: [...state.cycles, action.payload],
            activeCycleId: action.payload.id,
          };

        case "FINISH_ACTIVE_CYCLE":
          return {
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, finishedDate: new Date() };
              }

              return cycle;
            }),
            activeCycleId: null,
          };

        case "INTERRUPT_ACTIVE_CYCLE":
          return {
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, interruptedDate: new Date() };
              }

              return cycle;
            }),
            activeCycleId: null,
          };

        default:
          return state;
      }
    },
    { cycles: [], activeCycleId: null }
  );
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function createNewCycle(data: CreateNewCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      countdownInMinutes: data.countdownInMinutes,
      startDate: new Date(),
    };

    setAmountSecondsPassed(0);
    dispatch({
      type: "ADD_NEW_CYCLE",
      payload: newCycle,
    });
  }

  function interruptActiveCycle() {
    dispatch({
      type: "INTERRUPT_ACTIVE_CYCLE",
      payload: activeCycleId,
    });
  }

  function finishActiveCycle() {
    dispatch({
      type: "FINISH_ACTIVE_CYCLE",
      payload: activeCycleId,
    });
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
