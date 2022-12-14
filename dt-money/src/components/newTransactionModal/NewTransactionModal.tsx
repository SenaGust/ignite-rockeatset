import * as Dialog from "@radix-ui/react-dialog";
import { Controller, useForm } from "react-hook-form";
import { ArrowCircleUp, ArrowCircleDown, X } from "phosphor-react";
import {
  Overlay,
  Content,
  CloseButton,
  TransactionType,
  TransactionTypeButton,
} from "./NewTransactionModal.styles";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionContext } from "../../contexts/TransactionContext";
import { useContextSelector } from "use-context-selector";

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.string(),
  category: z.string(),
  type: z.enum(["income", "outcome"]),
});

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>;

export function NewTransactionModal() {
  const createTransaction = useContextSelector(
    TransactionContext,
    ({ createTransaction }) => createTransaction
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<NewTransactionFormInputs>({
    resolver: zodResolver(newTransactionFormSchema),
  });

  async function handleCreateNewTransaction({
    category,
    description,
    price,
    type,
  }: NewTransactionFormInputs) {
    createTransaction({
      category,
      description,
      price: Number(price),
      type,
    });

    reset();
  }

  return (
    <Dialog.Portal>
      <Overlay />
      <Content>
        <Dialog.Title>New Transaction</Dialog.Title>
        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input
            type="text"
            placeholder="Description"
            required
            {...register("description")}
          />
          <input
            type="number"
            placeholder="Price"
            required
            {...register("price")}
          />
          <input
            type="text"
            placeholder="Category"
            required
            {...register("category")}
          />

          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => {
              return (
                <TransactionType onValueChange={onChange} value={value}>
                  <TransactionTypeButton variant="income" value="income">
                    <ArrowCircleUp size={24} />
                    Income
                  </TransactionTypeButton>

                  <TransactionTypeButton variant="outcome" value="outcome">
                    <ArrowCircleDown size={24} />
                    Outcome
                  </TransactionTypeButton>
                </TransactionType>
              );
            }}
          />

          <button disabled={isSubmitting} type="submit">
            Create
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  );
}
