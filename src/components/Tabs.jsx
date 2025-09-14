import Paper from "../assets/icons/paperclip.svg?react";
import User from "../assets/icons/user.svg?react";

export default function Tabs({ active, setActive, counts, checked }) {
  const tabClass = (isActive) => 
    `pb-2 flex items-center gap-2 text-sm font-medium cursor-pointer ${
      active === isActive
        ? "border-b-2 border-black text-black"
        : "text-gray-500 hover:text-gray-700"
    }`;

  return (
    <ul className="flex items-center space-x-6">
      <button onClick={() => setActive("All")} className={tabClass("All")}>
        All
        <span className="flex text-xs text-gray-600 bg-gray-300 h-5 w-5 justify-center items-center rounded-[5px]">
          {counts.all}
        </span>
      </button>

      {checked.includes("Files") && (
        <button
          onClick={() => setActive("Files")}
          className={tabClass("Files")}
        >
          <Paper className="h-[20px] w-[20px]" />
          Files
          <span className="flex text-xs text-gray-600 bg-gray-300 h-5 w-5 justify-center items-center rounded-[5px]">
            {counts.files}
          </span>
        </button>
      )}

      {checked.includes("People") && (
        <button
          onClick={() => setActive("People")}
          className={tabClass("People")}
        >
          <User className="h-[18px]" />
          People
          <span className="flex text-xs text-gray-600 bg-gray-300 h-5 w-5 justify-center items-center rounded-[5px]">
            {counts.people}
          </span>
        </button>
      )}
    </ul>
  );
}
