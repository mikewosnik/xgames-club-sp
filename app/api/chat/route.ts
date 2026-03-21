import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { loadKnowledge, buildSystemPrompt, isRelevantQuery, isGreeting } from "@/lib/knowledge";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const REFUSAL =
  "Not sure what you mean, amigo! Ask me about the roster, our GM, the season stops, or the XGL format — I got you.";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_MESSAGES = 20;

// Server-side rate limiting (in-memory, per serverless instance)
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 20 * 60 * 1000; // 20 minutes

const ipStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now >= entry.resetAt) {
    ipStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function sanitizeText(text: string): string {
  // Strip control characters except newlines/tabs
  return text.replace(/[^\P{C}\n\t]/gu, "").trim();
}

function validateMessages(raw: unknown): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error("invalid_messages");
  }

  const allowed = raw.slice(-MAX_HISTORY_MESSAGES);

  return allowed.map((m) => {
    if (
      typeof m !== "object" || m === null ||
      !("role" in m) || !("content" in m) ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string"   // blocks / arrays rejected here
    ) {
      throw new Error("invalid_messages");
    }

    const content = sanitizeText(m.content).slice(0, MAX_MESSAGE_LENGTH);
    if (!content) throw new Error("invalid_messages");

    return { role: m.role as "user" | "assistant", content };
  });
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const { allowed, retryAfter } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: `Rate limit reached. Try again in ${Math.ceil(retryAfter / 60)} min.` },
        { status: 429 }
      );
    }

    const body = await req.json();

    let messages: { role: "user" | "assistant"; content: string }[];
    try {
      messages = validateMessages(body.messages);
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found." }, { status: 400 });
    }

    const isFirstMessage = messages.filter((m) => m.role === "user").length === 1;

    if (isFirstMessage && isGreeting(lastUserMessage.content)) {
      return NextResponse.json({
        reply: "Hey! Ask me about the XC São Paulo roster, our GM, the XGL format, or the 2026 season stops.\n\nou pergunte-me em português.\n\n私は日本語も話せます。",
      });
    }

    // Only enforce topic check on the first user message — follow-ups inherit context
    if (isFirstMessage && !isRelevantQuery(lastUserMessage.content)) {
      return NextResponse.json({ reply: REFUSAL });
    }

    const knowledge = await loadKnowledge();
    const systemPrompt = buildSystemPrompt(knowledge);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const reply = textBlock?.type === "text" ? textBlock.text : REFUSAL;

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[/api/chat] Error:", err);

    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `API error: ${err.message}` },
        { status: err.status ?? 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
