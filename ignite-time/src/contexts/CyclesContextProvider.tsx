import { useState, createContext, ReactNode } from "react";
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

export const CyclesContext = createContext({} as CyclesContextData);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Array<Cycle>>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function createNewCycle(data: CreateNewCycleData) {
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
  }

  function interruptActiveCycle() {
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
    setActiveCycleId(null);
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
