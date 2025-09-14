"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send } from "lucide-react";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { VenueSearchTool } from "@/components/custom-tools/venue-search-tool";
import { JudgeSearchTool } from "@/components/custom-tools/judge-search-tool";
import { MentorSearchTool } from "@/components/custom-tools/mentor-search-tool";
import { SponsorSearchTool } from "@/components/custom-tools/sponsor-search-tool";
import type { ToolUIPart } from "ai";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "./ai-elements/reasoning";

export function ChatInterface() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const quickStartOptions = [
    "RAG model hackathon for 40 people in central London",
    "AI/ML hackathon at Imperial College London",
    "Fintech hackathon with Revolut and Monzo sponsors",
    "Social impact hackathon for university students",
    "Healthcare innovation challenge with NHS partnership",
    "Web3 and blockchain hackathon in Shoreditch",
  ];

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    if (!hasText || !message.text) return;

    sendMessage({ text: message.text });
    setInput("");
  };

  const isLoading = status === "submitted";

  return (
    <div className="flex flex-col h-full border rounded-lg">
      {/* Simple Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold">HackGenie Assistant</h2>
      </div>

      <Conversation className="flex-1">
        <ConversationContent className="p-4">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="p-4 border rounded">
              <p>
                Welcome to HackGenie! Ask me anything about planning your
                hackathon.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              <Message from={message.role}>
                <MessageContent>
                  {message.parts?.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return <Response>{part.text}</Response>;

                      case "reasoning":
                        return (
                          <Reasoning
                            key={`${message.id}-${i}`}
                            className="w-full"
                            isStreaming={
                              status === "streaming" &&
                              i === message.parts.length - 1 &&
                              message.id === messages.at(-1)?.id
                            }
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        );

                      default:
                        if (part.type.startsWith("tool-")) {
                          const toolUIPart = part as ToolUIPart;

                          const getToolState = () => {
                            if (toolUIPart.state === "output-error")
                              return "error";
                            if (
                              toolUIPart.state === "output-available" &&
                              toolUIPart.output
                            )
                              return "success";
                            return "loading";
                          };

                          const toolState = getToolState();
                          const toolData =
                            toolState === "success"
                              ? (toolUIPart.output as { data?: unknown[] })
                                  ?.data
                              : undefined;
                          const errorMessage = toolUIPart.errorText;

                          return (
                            <div
                              key={`${message.id}-tool-${i}`}
                              className="mt-4"
                            >
                              {toolUIPart.type.includes("searchVenues") && (
                                <VenueSearchTool
                                  state={toolState}
                                  venues={toolData as never[]}
                                  error={errorMessage}
                                />
                              )}
                              {toolUIPart.type.includes("searchJudges") && (
                                <JudgeSearchTool
                                  state={toolState}
                                  judges={toolData as never[]}
                                  error={errorMessage}
                                />
                              )}
                              {toolUIPart.type.includes("searchMentors") && (
                                <MentorSearchTool
                                  state={toolState}
                                  mentors={toolData as never[]}
                                  error={errorMessage}
                                />
                              )}
                              {toolUIPart.type.includes("searchSponsors") && (
                                <SponsorSearchTool
                                  state={toolState}
                                  sponsors={toolData as never[]}
                                  error={errorMessage}
                                />
                              )}
                            </div>
                          );
                        }
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            </div>
          ))}

          {isLoading && (
            <div className="p-3 border rounded bg-gray-50">
              <p>Loading...</p>
            </div>
          )}
        </ConversationContent>
      </Conversation>

      {/* Simple Input Area */}
      <div className="p-4 border-t">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Describe your hackathon..."
              className="min-h-[60px] p-3 border rounded resize-none"
            />
          </PromptInputBody>
          <PromptInputToolbar className="mt-2 flex justify-end">
            <PromptInputSubmit
              disabled={!input.trim() || isLoading}
              status={status}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </PromptInputSubmit>
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
