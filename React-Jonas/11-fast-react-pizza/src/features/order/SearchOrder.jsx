import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchOrder() {
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  function handleSearch(e) {
    setQuery(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!query) return;

    navigate(`/order/${query}`);
    setQuery("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={handleSearch}
        placeholder="Search orderID..."
        className="rounded-full px-1 py-2 text-xs md:px-4 md:py-2 md:text-sm bg-yellow-50 placeholder:text-stone-500 w-28 md:w-64 md:focus:w-72 transition-all duration-300 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-opacity-50"
      />
    </form>
  );
}

export default SearchOrder;
