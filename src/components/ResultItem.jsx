import HighlightText from "./HighlightText";

const statusColor = {
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
};

export default function ResultItem({ item, query }) {
  const { dotColor } = item;

  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition">
      {"avatar" in item ? (
        <div className="relative">
          <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-2xl" />
          <div
            className={`absolute w-3 h-3 -bottom-0.5 -right-0.5 rounded-full border-2 border-white ${
              statusColor[dotColor] || "bg-gray-400"
            }`}
          />
        </div>
      ) : (
        <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded">
          📄
        </div>
      )}

      <div className="flex flex-col justify-center min-w-0">
        <p className="text-sm font-medium leading-tight">
          <HighlightText text={item.name} query={query} />
        </p>
        <p className="text-xs text-gray-500 leading-tight">
          {"status" in item ? item.status : `${item.location} • ${item.edited}`}
        </p>
      </div>
    </div>
  );
}
