import { useEffect, useState, useRef } from "react";
import { dummyData } from "./assets/dummy";
import Filter from "./assets/icons/filter.svg?react";
import Search from "./assets/icons/search.svg?react";
import Spinner from "./assets/icons/spinner.svg?react";
import Paper from "./assets/icons/paperclip.svg?react";
import User from "./assets/icons/user.svg?react";

//highlight search term
function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("All");
  const [counts, setCounts] = useState({ all: 0, files: 0, people: 0 });
  const [checked, setChecked] = useState(["People"]);
  const dropdownRef = useRef(null);

  const handleClear = () => {
    setQuery("");
  };

  const statusColor = {
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
  };

  //Store all data in a single array
  const allData = [...dummyData.files, ...dummyData.people];
  // filter data
  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(() => {
      let filtered = allData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

      filtered = filtered.filter((item) => {
        if ("avatar" in item) {
          return checked.includes("People");
        } else {
          return checked.includes("Files");
        }
      });

      setCounts({
        all: filtered.length,
        files: filtered.filter((i) => !("avatar" in i)).length,
        people: filtered.filter((i) => "avatar" in i).length,
      });

      setResults(filtered);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [query, checked]);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  //Checkbox function
  const handleChecked = (key) => {
    setChecked(
      (prev) =>
        prev.includes(key)
          ? prev.filter((item) => item !== key) // uncheck
          : [...prev, key] // check
    );
  };

  return (
    <div className="relative w-[500px] mx-auto mt-8 bg-white shadow rounded-2xl p-4">
      <div className="flex items-center justify-between">
        {/* Search Input / Spinner*/}
        {loading ? <Spinner className="animate-spin" /> : <Search />}

        <input
          type="text"
          value={query}
          placeholder="Searching is easier..."
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 text-lg focus:outline-none"
        />
        {/* Clear */}
        {query && (
          <button
            className="cursor-pointer underline text-sm"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>

      {/* Display search container */}
      {query === "" ? null : (
        <>
          <div className="flex items-center justify-between max-h-8 ml-2 mt-3">
            <ul className="flex items-center space-x-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setActive("All")}
                  className={`pb-2 flex items-center gap-2 text-sm font-medium cursor-pointer ${
                    active === "All"
                      ? "border-b-2 border-black text-black"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All
                  <span className="flex text-xs text-gray-600 bg-gray-300 h-5 w-5 justify-center items-center rounded-[5px]">
                    {counts.all}
                  </span>
                </button>
              </div>

              {checked.includes("Files") && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setActive("Files")}
                    className={`pb-2 flex items-center gap-1 text-sm font-medium ${
                      active === "Files"
                        ? "border-b-2 border-black-500 cursor-pointer text-black-600"
                        : "text-gray-500 cursor-pointer hover:text-gray-700"
                    }`}
                  >
                    <div className="h-[24px] flex items-center justify-center">
                      <Paper className="h-[20px] w-[20px]" />
                    </div>
                    Files
                    <span className="flex text-xs text-gray-600 bg-gray-300 h-5 w-5 justify-center items-center rounded-[5px]">
                      {counts.files}
                    </span>
                  </button>
                </div>
              )}

              {checked.includes("People") && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setActive("People")}
                    className={`pb-2 flex items-center gap-1 text-sm font-medium ${
                      active === "People"
                        ? "border-b-2 border-black-500 cursor-pointer text-black-600"
                        : "text-gray-500 cursor-pointer hover:text-gray-700"
                    }`}
                  >
                    <div className="h-[24px] flex items-center -ml-2 justify-center">
                      <User className="h-[18px]" />
                    </div>
                    People
                    <span className="flex text-xs text-gray-600 bg-gray-300 h-5 w-5 justify-center items-center rounded-[5px]">
                      {counts.people}
                    </span>
                  </button>
                </div>
              )}
            </ul>

            {/* Filter Icon + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Filter
                className="cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
              />
              {isOpen && (
                <div className="absolute right-0 border border-gray-200 mt-[20px] w-48 bg-white rounded-lg shadow-md py-2 z-10">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-[24px] flex items-center justify-center">
                        <Paper className="h-[18px] w-[22px]" />
                      </div>
                      <span className="text-gray-900">Files</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={checked.includes("Files")}
                        onChange={() => handleChecked("Files")}
                      />
                      <div
                        className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                    after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"
                      ></div>
                    </label>
                  </div>

                  <div className="px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-0">
                      <div className="h-[24px] flex items-center -ml-1 justify-center">
                        <User className="h-5 text-gray-600" />
                      </div>
                      <span className="text-gray-900">People</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={checked.includes("People")}
                        onChange={() => handleChecked("People")}
                      />
                      <div
                        className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                    after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"
                      ></div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="absolute left-0 right-0 h-0.5 mt-2 w-full bg-gray-200 shadow-md"></div>

          {/* Results */}
          <div className="mt-4 space-y-3 max-h-[400px] overflow-auto">
            {loading ? (
              <p className="text-center text-gray-500 text-sm py-4">
                Searching...
              </p>
            ) : results.length === 0 && query !== "" ? (
              <p className="text-center text-gray-500 text-sm py-4">
                No results found
              </p>
            ) : (
              results.map((item) => {
                const { dotColor } = item;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition"
                  >
                    {/* Avatar or file icon */}
                    {"avatar" in item ? (
                      <div className="relative">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-10 h-10 rounded-2xl"
                        />
                        <div
                          className={`absolute w-3 h-3 -bottom-0.5 -right-0.5 rounded-full border-2 border-white ${
                            statusColor[dotColor] || "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded">
                        📄
                      </div>
                    )}

                    {/* Text */}
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-sm font-medium leading-tight">
                        {highlightMatch(item.name, query)}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {"status" in item
                          ? item.status
                          : `${item.location} • ${item.edited}`}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
