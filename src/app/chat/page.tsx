"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Sparkles, Bot, Stethoscope } from "lucide-react";
import { Card } from "@/components/ui/card";

import { Suspense } from "react";

function ChatContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const topicId = searchParams.get("topicId");
  const isSpecialist = mode === "specialist";

  // State for input
  const [inputVal, setInputVal] = useState("");

  const { messages, sendMessage, status } = useChat({
    body: {
      mode,
      topicId,
    },
  } as any);

  return (
    <div className="flex flex-col h-screen">
      {/* ... Content ... */}
      <div className="flex items-center space-x-2 pb-2">
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center ${isSpecialist ? "bg-amber-500/10" : "bg-primary/10"}`}
        >
          {isSpecialist ? (
            <Stethoscope className="h-4 w-4 text-amber-500" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary" />
          )}
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {isSpecialist ? "Topic Specialist" : "AI Quiz Generator"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isSpecialist
              ? "Deep dive diagnosis & understanding"
              : "Test your knowledge on any topic"}
          </p>
        </div>
      </div>
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="Start a conversation"
              description="Type a message below to begin"
            />
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.role === "assistant" ? (
                    <MessageResponse>
                      {message.parts
                        ?.filter((part: any) => part.type === "text")
                        .map((part: any) => part.text)
                        .join("")}
                    </MessageResponse>
                  ) : (
                    message.parts?.map(
                      (part: any) => part.type === "text" && part.text,
                    )
                  )}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
      </Conversation>

      <div className="border-t p-4">
        <PromptInput
          onSubmit={(message, event) => {
            event.preventDefault();
            if (message.text) {
              // @ts-ignore
              sendMessage(
                { role: "user", parts: [{ type: "text", text: message.text }] },
                { body: { mode, topicId } },
              );
              setInputVal("");
            }
          }}
          className="max-w-3xl mx-auto flex gap-2 items-end"
        >
          <PromptInputTextarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your message..."
            disabled={status === "streaming" || status === "submitted"}
            rows={1}
            className="flex-1"
          />
          <PromptInputSubmit
            disabled={status === "streaming" || status === "submitted"}
          />
        </PromptInput>
      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
