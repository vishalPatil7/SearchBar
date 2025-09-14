import Search from "../assets/icons/search.svg?react";
import Spinner from "../assets/icons/spinner.svg?react";

export default function SearchInput({ query, setQuery, loading, onClear }) {
  return (
    <div className="flex items-center justify-between">
      {loading ? <Spinner className="animate-spin" /> : <Search />}
      <input
        type="text"
        value={query}
        placeholder="Searching is easier..."
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 text-lg focus:outline-none"
      />
      {query && (
        <button
          className="cursor-pointer underline text-sm"
          onClick={onClear}
        >
          Clear
        </button>
      )}
    </div>
  );
}
