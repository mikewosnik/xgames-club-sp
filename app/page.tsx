"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import InputBar from "@/components/InputBar";
import { Message } from "@/lib/types";

const SUGGESTIONS = [
  "Who is the GM of XC São Paulo?",
  "How does the XGL championship work?",
  "Quem são os atletas brasileiros do elenco?",
  "ロスターに日本人選手はいますか？",
  "¿Quién es Queen Saray Villegas?",
];

const MSG_LIMIT = 20;
const COOLDOWN_MS = 20 * 60 * 1000; // 20 minutes

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldownUntil === null) return;

    const tick = () => {
      const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setSecondsLeft(0);
        setCooldownUntil(null);
        setUserMsgCount(0);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setSecondsLeft(remaining);
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [cooldownUntil]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading || cooldownUntil !== null) return;

    const nextCount = userMsgCount + 1;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserMsgCount(nextCount);
    setLoading(true);
    setError(null);

    if (nextCount >= MSG_LIMIT) {
      setCooldownUntil(Date.now() + COOLDOWN_MS);
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  }, [messages, loading, userMsgCount, cooldownUntil]);

  const isEmpty = messages.length === 0;
  const isCoolingDown = cooldownUntil !== null;

  return (
    <div className="flex w-screen overflow-hidden" style={{ height: "100dvh" }}>
      <Sidebar />
      <main className="flex flex-col flex-1 min-w-0 bg-white pt-14 md:pt-0">
        <ChatArea
          messages={messages}
          loading={loading}
          isEmpty={isEmpty}
          suggestions={SUGGESTIONS}
          onSuggestion={sendMessage}
        />
        {error && (
          <div className="mx-4 mb-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        <InputBar
          onSend={sendMessage}
          loading={loading}
          isCoolingDown={isCoolingDown}
          secondsLeft={secondsLeft}
          msgsLeft={Math.max(0, MSG_LIMIT - userMsgCount)}
        />
      </main>
    </div>
  );
}
