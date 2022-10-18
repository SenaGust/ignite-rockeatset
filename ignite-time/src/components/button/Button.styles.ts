import styled from "styled-components";
import { ButtonVariant } from "./Button.types";

interface ButtonContainerProps {
  variant: ButtonVariant;
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;
  background-color: ${({ variant, theme }) => theme["green-300"]};
`;
