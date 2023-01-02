import { MagnifyingGlass } from "phosphor-react";
import { useForm } from "react-hook-form";
import { SearchFormContainer } from "./SearchForm.styles";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionContext } from "../../../../contexts/TransactionContext";
import { useContextSelector } from "use-context-selector";

const searchFormSchema = z.object({
  search: z.string(),
});

type SearchFormInputs = z.infer<typeof searchFormSchema>;

export function SearchForm() {
  const fetchTransactions = useContextSelector(
    TransactionContext,
    ({ fetchTransactions }) => fetchTransactions
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema),
  });

  async function handleSearchTransactions({ search }: SearchFormInputs) {
    await fetchTransactions(search);
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input
        type="text"
        placeholder="Search transactions"
        {...register("search")}
      />

      <button disabled={isSubmitting}>
        <MagnifyingGlass />
        Search
      </button>
    </SearchFormContainer>
  );
}
