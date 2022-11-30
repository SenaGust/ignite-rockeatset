import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import { Overlay, Content, CloseButton } from "./NewTransactionModal.styles";

export function NewTransactionModal() {
  return (
    <Dialog.Portal>
      <Overlay />
      <Content>
        <Dialog.Title>New Transaction</Dialog.Title>
        <CloseButton>
          <X />
        </CloseButton>

        <form action="">
          <input type="text" placeholder="Description" required />
          <input type="number" placeholder="Price" required />
          <input type="text" placeholder="Category" required />

          <button type="submit">Create</button>
        </form>
      </Content>
    </Dialog.Portal>
  );
}
