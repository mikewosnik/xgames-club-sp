"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Message } from "@/lib/types";
import ChatMessage from "./ChatMessage";
import SuggestionChips from "./SuggestionChips";

interface ChatAreaProps {
  messages: Message[];
  loading: boolean;
  isEmpty: boolean;
  suggestions: string[];
  onSuggestion: (text: string) => void;
}

export default function ChatArea({ messages, loading, isEmpty, suggestions, onSuggestion }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto custom-scroll px-4 md:px-8 py-6">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-xblue-50 text-xblue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-xblue-500" />
              Official Club Assistant
            </div>
            <h1 className="text-2xl font-bold text-xgray-900 mb-2">
              Welcome to X Games Club São Paulo
            </h1>
            <p className="text-xgray-500 text-sm leading-relaxed">
              Ask me about the club's GM, roster, the XGL format, the 2026 season schedule, or anything officially supported by the club.
            </p>
          </div>
          <SuggestionChips suggestions={suggestions} onSelect={onSuggestion} />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-2">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {loading && (
            <div className="flex items-start gap-3 animate-fadeIn">
              <div className="w-7 h-7 rounded-full bg-xblue-700 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden animate-pulse">
                <Image src="/shorthand-blue.svg" alt="XG" width={28} height={28} />
              </div>
              <div className="bg-xgray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 bg-xgray-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-xgray-400 rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
                  <span className="w-1.5 h-1.5 bg-xgray-400 rounded-full animate-pulse" style={{ animationDelay: "400ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
