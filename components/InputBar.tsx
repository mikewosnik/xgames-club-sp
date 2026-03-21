"use client";

import { useState, KeyboardEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  loading: boolean;
  isCoolingDown: boolean;
  secondsLeft: number;
  msgsLeft: number;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function InputBar({ onSend, loading, isCoolingDown, secondsLeft, msgsLeft }: Props) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || loading || isCoolingDown) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isCoolingDown) {
    return (
      <div className="px-4 md:px-8 pt-3 border-t border-xgray-200 bg-white" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-2 bg-xblue-500 rounded-2xl px-6 py-5 text-white text-center">
          <div className="text-2xl font-bold tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
            {fmt(secondsLeft)}
          </div>
          <p className="text-sm font-semibold">Take a breather</p>
          <p className="text-xs opacity-70">
            You've covered the essentials. The assistant will be back in {fmt(secondsLeft)}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 pt-3 border-t border-xgray-200 bg-white" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
      <div className="max-w-2xl mx-auto flex items-end gap-3 bg-xgray-50 border border-xgray-300 rounded-2xl px-4 py-3 focus-within:border-xblue-500 focus-within:ring-2 focus-within:ring-xblue-100 transition-all">
        <textarea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about the club, GM, season, roster…"
          disabled={loading}
          className="flex-1 resize-none bg-transparent text-sm text-xgray-900 placeholder-xgray-400 outline-none max-h-32 overflow-y-auto custom-scroll disabled:opacity-50"
          style={{ lineHeight: "1.5" }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || loading}
          aria-label="Send message"
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-xblue-600 text-white hover:bg-xblue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>
      <div className="max-w-2xl mx-auto flex items-center justify-between mt-2 px-1">
        <p className="text-[10px] text-xgray-400">
          Answers are based exclusively on the official X Games Club São Paulo knowledge base.
        </p>
        {msgsLeft <= 5 && (
          <p className="text-[10px] font-semibold text-amber-500 shrink-0 ml-3">
            {msgsLeft} {msgsLeft === 1 ? "message" : "messages"} left
          </p>
        )}
      </div>
    </div>
  );
}
