"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Zap } from "lucide-react";
import type { HackathonPlan } from "@/types/hackathon";

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
import { Tool, ToolContent, ToolTrigger } from "@/components/ai-elements/tool";

interface ChatInterfaceProps {
  hackathonPlan: HackathonPlan;
  setHackathonPlan: (plan: HackathonPlan) => void;
}

export function ChatInterface({
  hackathonPlan,
  setHackathonPlan,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! I'm HackGenie, your AI hackathon planning assistant with 10+ years of experience organizing successful events. I'll help you plan an amazing hackathon in under 5 minutes by finding the perfect venues, expert judges, experienced mentors, and potential sponsors. What kind of hackathon are you planning?",
      },
    ],
  });

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" && lastMessage.toolInvocations) {
      lastMessage.toolInvocations.forEach((toolCall) => {
        if (toolCall.toolName === "searchVenues" && toolCall.result?.success) {
          setHackathonPlan((prev) => ({
            ...prev,
            venues: toolCall.result.data,
          }));
        } else if (
          toolCall.toolName === "searchJudges" &&
          toolCall.result?.success
        ) {
          setHackathonPlan((prev) => ({
            ...prev,
            judges: toolCall.result.data,
          }));
        } else if (
          toolCall.toolName === "searchMentors" &&
          toolCall.result?.success
        ) {
          setHackathonPlan((prev) => ({
            ...prev,
            mentors: toolCall.result.data,
          }));
        } else if (
          toolCall.toolName === "searchSponsors" &&
          toolCall.result?.success
        ) {
          setHackathonPlan((prev) => ({
            ...prev,
            sponsors: toolCall.result.data,
          }));
        }
      });
    }
  }, [messages, setHackathonPlan]);

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
    if (!hasText) return;

    sendMessage({ text: message.text });
    setInput("");
  };

  const handleQuickStart = (message: string) => {
    sendMessage({ text: message });
  };

  return (
    <div className="flex flex-col h-full">
      <Conversation className="h-full">
        <ConversationContent>
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
                        <Response>{message.content}</Response>
                      </div>
                    </div>
                  )}
                  {message.role === "user" && (
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-[80%]">
                        <Response>{message.content}</Response>
                      </div>
                    </div>
                  )}
                </MessageContent>
              </Message>

              {message.toolInvocations?.map((toolCall, index) => (
                <Tool key={`${message.id}-${index}`} className="mt-2">
                  <ToolTrigger>
                    {toolCall.toolName === "searchVenues" &&
                      "🏢 Searching venues..."}
                    {toolCall.toolName === "searchJudges" &&
                      "👨‍⚖️ Finding judges..."}
                    {toolCall.toolName === "searchMentors" &&
                      "👨‍🏫 Finding mentors..."}
                    {toolCall.toolName === "searchSponsors" &&
                      "💰 Finding sponsors..."}
                  </ToolTrigger>
                  <ToolContent>
                    {toolCall.result?.success ? (
                      <div className="text-sm text-green-600">
                        Found {toolCall.result.data?.length || 0} results
                      </div>
                    ) : (
                      <div className="text-sm text-red-600">Search failed</div>
                    )}
                  </ToolContent>
                </Tool>
              ))}
            </div>
          ))}
          {status === "submitted" && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Quick Start Options */}
      {messages.length === 1 && (
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
                disabled={status === "submitted"}
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
          <PromptInputSubmit disabled={!input.trim()} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
