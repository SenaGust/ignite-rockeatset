import styled from "styled-components";

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme["gray-100"]};
  font-size: 1.125rem;
  font-weight: bold;
  flex-wrap: wrap;
`;

export const CountDownSeparator = styled.div`
  padding: 2rem 0rem;
  color: ${({ theme }) => theme["green-500"]};
  width: 4rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
`;

const BaseInput = styled.input`
  background: transparent;
  height: 2.5rem;
  border: 0;
  border-bottom: 2px solid ${({ theme }) => theme["green-500"]};
  font-size: 1.125rem;
  padding: 0 0.5rem;
  color: ${({ theme }) => theme["gray-100"]};

  &:focus {
    box-shadow: none;
    border-color: ${({ theme }) => theme["green-500"]};
  }

  &&::placeholder {
    color: ${({ theme }) => theme["gray-500"]};
  }
`;

export const TaskInput = styled(BaseInput)`
  flex: 1;
  &::-webkit-calendar-picker-indicator {
    display: none !important;
  }
`;

export const CountdownInput = styled(BaseInput)`
  width: 4rem;
`;
