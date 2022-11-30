import { MagnifyingGlass } from "phosphor-react";
import { SearchFormContainer } from "./SearchForm.styles";

export function SearchForm() {
  return (
    <SearchFormContainer>
      <input type="text" placeholder="Search transactions" />

      <button>
        <MagnifyingGlass />
        Search
      </button>
    </SearchFormContainer>
  );
}
