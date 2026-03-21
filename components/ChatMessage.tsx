import Image from "next/image";
import { Message } from "@/lib/types";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 animate-fadeIn ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 overflow-hidden ${isUser ? "bg-xgray-200 text-xgray-700" : "bg-xblue-700 text-white"}`}>
        {isUser ? "You" : <Image src="/shorthand-blue.svg" alt="XG" width={28} height={28} />}
      </div>
      <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${isUser ? "bg-xblue-600 text-white rounded-tr-sm" : "bg-xgray-100 text-xgray-900 rounded-tl-sm"}`}>
        {message.content}
      </div>
    </div>
  );
}
