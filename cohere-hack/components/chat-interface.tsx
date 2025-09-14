"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Zap } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
import { VenueSearchTool } from "@/components/custom-tools/venue-search-tool";
import { JudgeSearchTool } from "@/components/custom-tools/judge-search-tool";
import { MentorSearchTool } from "@/components/custom-tools/mentor-search-tool";
import { SponsorSearchTool } from "@/components/custom-tools/sponsor-search-tool";
import type { ToolUIPart } from "ai";

export function ChatInterface() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const quickStartOptions = [
    "Climate tech hackathon for 100 people in SF",
    "AI/ML hackathon at Stanford University",
    "Fintech hackathon with corporate sponsors",
    "Social impact hackathon for students",
    "Healthcare innovation challenge",
    "Web3 and blockchain hackathon",
  ];

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    if (!hasText || !message.text) return;

    sendMessage({ text: message.text });
    setInput("");
  };

  const handleQuickStart = (message: string) => {
    sendMessage({ text: message });
  };

  const isLoading = status === "submitted" || status === "streaming";

  // Extract text content from message
  const getMessageText = (message: any) => {
    if (message.parts && Array.isArray(message.parts)) {
      const textPart = message.parts.find((p: any) => p.type === "text");
      return textPart?.text || "";
    }
    return message.content || "";
  };





  return (
    <div className="flex flex-col h-full">
      <Conversation className="h-full">
        <ConversationContent>
          {/* Welcome message when no messages */}
          {messages.length === 0 && (
            <div>
              <Message from="assistant">
                <MessageContent>
                  <div className="flex gap-3 items-start">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                        HG
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Response>
                        Hi! I'm HackGenie, your AI hackathon planning assistant
                        with 10+ years of experience organizing successful
                        events. I'll help you plan an amazing hackathon in under
                        5 minutes by finding the perfect venues, expert judges,
                        experienced mentors, and potential sponsors. What kind
                        of hackathon are you planning?
                      </Response>
                    </div>
                  </div>
                </MessageContent>
              </Message>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id}>
              <Message from={message.role}>
                <MessageContent>
                  {message.role === "assistant" && (
                    <div className="flex gap-3 items-start">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                          HG
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Response>{getMessageText(message)}</Response>
                      </div>
                    </div>
                  )}
                  {message.role === "user" && (
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-[80%]">
                        <Response>{getMessageText(message)}</Response>
                      </div>
                    </div>
                  )}
                </MessageContent>
              </Message>

              {/* Render custom tool UIs */}
              {message.parts
                ?.filter((part) => part.type.startsWith("tool-"))
                .map((toolPart, index) => {
                  const toolUIPart = toolPart as ToolUIPart;

                  // Determine tool state and data
                  const getToolState = () => {
                    if (toolUIPart.state === "output-error") return "error";
                    if (toolUIPart.state === "output-available" && toolUIPart.output) return "success";
                    return "loading";
                  };

                  const toolState = getToolState();
                  const toolData = toolState === "success" ? (toolUIPart.output as any)?.data : undefined;
                  const errorMessage = toolUIPart.errorText;

                  return (
                    <div key={`${message.id}-tool-${index}`} className="mt-4">
                      {toolUIPart.type.includes("searchVenues") && (
                        <VenueSearchTool
                          state={toolState}
                          venues={toolData}
                          error={errorMessage}
                        />
                      )}
                      {toolUIPart.type.includes("searchJudges") && (
                        <JudgeSearchTool
                          state={toolState}
                          judges={toolData}
                          error={errorMessage}
                        />
                      )}
                      {toolUIPart.type.includes("searchMentors") && (
                        <MentorSearchTool
                          state={toolState}
                          mentors={toolData}
                          error={errorMessage}
                        />
                      )}
                      {toolUIPart.type.includes("searchSponsors") && (
                        <SponsorSearchTool
                          state={toolState}
                          sponsors={toolData}
                          error={errorMessage}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
          {isLoading && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Quick Start Options */}
      {messages.length === 0 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-medium text-foreground">
              Quick start options:
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {quickStartOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start text-left h-auto py-3 px-3 bg-transparent hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950"
                onClick={() => handleQuickStart(option)}
                disabled={isLoading}
              >
                <span className="text-sm">{option}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <PromptInput onSubmit={handleSubmit} className="mt-4">
        <PromptInputBody>
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Describe your hackathon..."
          />
        </PromptInputBody>
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputButton
              variant="ghost"
              onClick={() => {
                /* Add future features */
              }}
            >
              <Zap className="w-4 h-4" />
              <span>Quick Actions</span>
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit
            disabled={!input.trim() || isLoading}
            status={status}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

