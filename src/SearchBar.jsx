import { useEffect, useState } from "react";
import { dummyData } from "./assets/dummy";
import SearchInput from "./components/SearchInput";
import Tabs from "./components/Tabs";
import FilterDropdown from "./components/FilterDropdown";
import ResultItem from "./components/ResultItem";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("All");
  const [counts, setCounts] = useState({ all: 0, files: 0, people: 0 });
  const [checked, setChecked] = useState(["People"]);

  const allData = [...dummyData.files, ...dummyData.people];

  const handleClear = () => setQuery("");
  const handleChecked = (key) => {
    setChecked((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      const filtered = allData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

      const tabCounts = filtered.filter((item) =>
        "avatar" in item
          ? checked.includes("People")
          : checked.includes("Files")
      );

      setCounts({
        all: tabCounts.length,
        files: tabCounts.filter((i) => !("avatar" in i)).length,
        people: tabCounts.filter((i) => "avatar" in i).length,
      });

      setResults(filtered);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [query, checked]);

  const tabBasedResults =
    active === "People"
      ? results.filter((i) => "avatar" in i)
      : active === "Files"
      ? results.filter((i) => !("avatar" in i))
      : results;

  return (
    <div className="relative w-[500px] mx-auto mt-8 bg-white shadow rounded-2xl p-4">
      <SearchInput
        query={query}
        setQuery={setQuery}
        loading={loading}
        onClear={handleClear}
      />

      {query !== "" && (
        <>
          <div className="flex items-center justify-between max-h-8 ml-2 mt-3">
            <Tabs
              active={active}
              setActive={setActive}
              counts={counts}
              checked={checked}
            />
            <FilterDropdown
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              checked={checked}
              handleChecked={handleChecked}
            />
          </div>

          <div className="absolute left-0 right-0 h-0.5 mt-2 w-full bg-gray-200 shadow-md"></div>

          <div className="mt-4 space-y-3 max-h-[400px] overflow-auto">
            {loading ? (
              <p className="text-center text-gray-500 text-sm py-4">
                Searching...
              </p>
            ) : results.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-4">
                No results found
              </p>
            ) : (
              tabBasedResults.map((item) => (
                <ResultItem key={item.id} item={item} query={query} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
