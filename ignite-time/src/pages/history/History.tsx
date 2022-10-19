import { HistoryContainer, HistoryList, StatusBadge } from "./History.styles";

export function History() {
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
            <tr>
              <td>Tarefa</td>
              <td>20 minutos</td>
              <td>Há 5 minutos</td>
              <td>
                <StatusBadge color="green">Completed</StatusBadge>
              </td>
            </tr>

            <tr>
              <td>Tarefa</td>
              <td>20 minutos</td>
              <td>Há 5 minutos</td>
              <td>
                <StatusBadge color="red">Stopped</StatusBadge>
              </td>
            </tr>

            <tr>
              <td>Tarefa</td>
              <td>20 minutos</td>
              <td>Há 5 minutos</td>
              <td>
                <StatusBadge color="yellow">In progress</StatusBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
