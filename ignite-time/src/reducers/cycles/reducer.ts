import { Cycle } from "../../@types/Cycle";
import { ActionTypes } from "./actions";

interface CyclesState {
  cycles: Array<Cycle>;
  activeCycleId?: string | null;
}

interface CyclesAction {
  type: ActionTypes;
  payload?: any;
}

export function cyclesReducer(state: CyclesState, action: CyclesAction) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return {
        cycles: [...state.cycles, action.payload],
        activeCycleId: action.payload.id,
      };

    case ActionTypes.FINISH_ACTIVE_CYCLE:
      return {
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, finishedDate: new Date() };
          }

          return cycle;
        }),
        activeCycleId: null,
      };

    case ActionTypes.INTERRUPT_ACTIVE_CYCLE:
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
}
