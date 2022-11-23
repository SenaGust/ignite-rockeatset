import { useContext } from "react";
import { formatDistanceToNow } from "date-fns";

import { CyclesContext } from "../../contexts/CyclesContextProvider";
import { HistoryContainer, HistoryList, StatusBadge } from "./History.styles";

export function History() {
  const { cycles } = useContext(CyclesContext);

  return (
    <HistoryContainer>
      <h1>My History</h1>
      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Duration</th>
              <th>Start</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => (
              <tr key={cycle.id}>
                <td>{cycle.task}</td>
                <td>{cycle.countdownInMinutes} minute</td>
                <td>
                  {formatDistanceToNow(cycle.startDate, { addSuffix: true })}
                </td>
                <td>
                  {cycle.finishedDate && (
                    <StatusBadge color="green">Completed</StatusBadge>
                  )}
                  {cycle.interruptedDate && (
                    <StatusBadge color="red">Interrupted</StatusBadge>
                  )}
                  {!cycle.finishedDate && !cycle.interruptedDate && (
                    <StatusBadge color="yellow">In progress</StatusBadge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
