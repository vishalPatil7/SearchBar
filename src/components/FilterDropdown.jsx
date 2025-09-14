import Filter from "../assets/icons/filter.svg?react";
import Paper from "../assets/icons/paperclip.svg?react";
import User from "../assets/icons/user.svg?react";
import { useRef, useEffect } from "react";

export default function FilterDropdown({
  isOpen,
  setIsOpen,
  checked,
  handleChecked,
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Filter
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      />
      {isOpen && (
        <div className="absolute right-0 border border-gray-200 mt-[20px] w-48 bg-white rounded-lg shadow-md py-2 z-10">
          {[
            { label: "People", icon: <User className="h-[20px] text-gray-600" /> },
            { label: "Files", icon: <Paper className="h-[18px] w-[22px]" /> },
          ].map(({ label, icon }) => (
            <div
              key={label}
              className="px-4 py-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-1">
                {icon}
                <span>{label}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={checked.includes(label)}
                  onChange={() => handleChecked(label)}
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
