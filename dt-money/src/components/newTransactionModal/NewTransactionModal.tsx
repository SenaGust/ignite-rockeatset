import * as Dialog from "@radix-ui/react-dialog";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { ArrowCircleUp, ArrowCircleDown, X } from "phosphor-react";
import {
  Overlay,
  Content,
  CloseButton,
  TransactionType,
  TransactionTypeButton,
} from "./NewTransactionModal.styles";

export function NewTransactionModal() {
  return (
    <Dialog.Portal>
      <Overlay />
      <Content>
        <Dialog.Title>New Transaction</Dialog.Title>
        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form action="">
          <input type="text" placeholder="Description" required />
          <input type="number" placeholder="Price" required />
          <input type="text" placeholder="Category" required />

          <TransactionType>
            <TransactionTypeButton variant="income" value="income">
              <ArrowCircleUp size={24} />
              Income
            </TransactionTypeButton>

            <TransactionTypeButton variant="outcome" value="outcome">
              <ArrowCircleDown size={24} />
              Outcome
            </TransactionTypeButton>
          </TransactionType>

          <button type="submit">Create</button>
        </form>
      </Content>
    </Dialog.Portal>
  );
}
