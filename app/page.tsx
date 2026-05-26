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

const LS_MESSAGES = "xgames_messages";
const LS_COUNT = "xgames_msg_count";
const LS_COOLDOWN = "xgames_cooldown_until";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(LS_MESSAGES);
      const storedCount = localStorage.getItem(LS_COUNT);
      const storedCooldown = localStorage.getItem(LS_COOLDOWN);
      if (storedMessages) setMessages(JSON.parse(storedMessages));
      if (storedCount) setUserMsgCount(parseInt(storedCount, 10));
      if (storedCooldown) {
        const until = parseInt(storedCooldown, 10);
        if (until > Date.now()) setCooldownUntil(until);
      }
    } catch {}
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(LS_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(LS_COUNT, String(userMsgCount));
  }, [userMsgCount]);

  useEffect(() => {
    if (cooldownUntil !== null) {
      localStorage.setItem(LS_COOLDOWN, String(cooldownUntil));
    } else {
      localStorage.removeItem(LS_COOLDOWN);
    }
  }, [cooldownUntil]);

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

      const contentType = res.headers.get("Content-Type") ?? "";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant" as const, content: data.reply },
        ]);
      } else {
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        const msgId = crypto.randomUUID();

        setMessages((prev) => [
          ...prev,
          { id: msgId, role: "assistant" as const, content: "" },
        ]);

        let done = false;
        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: !streamDone });
            setMessages((prev) => {
              const idx = prev.findIndex((m) => m.id === msgId);
              if (idx === -1) return prev;
              return [
                ...prev.slice(0, idx),
                { ...prev[idx], content: prev[idx].content + chunk },
                ...prev.slice(idx + 1),
              ];
            });
          }
        }
      }
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
      <Sidebar
        onReset={() => {
          setMessages([]);
          setUserMsgCount(0);
          setCooldownUntil(null);
          setError(null);
          localStorage.removeItem(LS_MESSAGES);
          localStorage.removeItem(LS_COUNT);
          localStorage.removeItem(LS_COOLDOWN);
        }}
        onSelectPerson={(name) => sendMessage(`Who is ${name} on the XC São Paulo roster?`)}
      />
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
