interface Props {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export default function SuggestionChips({ suggestions, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="px-3 py-2 rounded-full border border-xgray-300 text-xs text-xgray-700 bg-white hover:border-xblue-500 hover:text-xblue-700 hover:bg-xblue-50 transition-colors duration-150 cursor-pointer"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
