"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
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

  const handleQuickStart = (text: string) => {
    sendMessage({ text });
    setInput("");
  };

  const isSubmitting = status === "submitted";
  const isStreaming = status === "streaming";
  const isBusy = isSubmitting || isStreaming;

  // Plan selections
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [selectedJudgeIds, setSelectedJudgeIds] = useState<Set<string>>(new Set());
  const [selectedSponsorIds, setSelectedSponsorIds] = useState<Set<string>>(new Set());


  const canCreateLuma = Boolean(selectedVenueId) && selectedJudgeIds.size > 0;

  const toggleFromSet = (setter: (s: Set<string>) => void, id: string) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Aggregate latest tool results for the planning sidebar
  const plan = useMemo(() => {
    const latest = {
      venues: [] as unknown[],
      judges: [] as unknown[],
      sponsors: [] as unknown[],
    };

    for (const m of messages) {
      for (const part of m.parts ?? []) {
        if (typeof part.type === "string" && part.type.startsWith("tool-")) {
          const toolUIPart = part as ToolUIPart;
          if (toolUIPart.state === "output-available" && toolUIPart.output) {
            const data = (toolUIPart.output as { data?: unknown[] })?.data ?? [];
            if (toolUIPart.type.includes("searchVenues")) latest.venues = data;
            if (toolUIPart.type.includes("searchJudges")) latest.judges = data;
            if (toolUIPart.type.includes("searchSponsors")) latest.sponsors = data;
          }
        }
      }
    }
    return latest;
  }, [messages]);

  return (
    <div className="h-full w-full grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
      <div className="flex flex-col min-h-0">
        <Conversation className="flex-1">
          <ConversationContent className="p-4">
          {/* Empty state with quick starts */}
          {messages.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6">
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Plan your hackathon in minutes</h3>
                <p className="text-sm text-muted-foreground">
                  Ask a question or try a quick start below.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {quickStartOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleQuickStart(opt)}
                    className="text-left rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-sm hover:bg-accent/30 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              <Message from={message.role}>
                <MessageContent className="lg:!max-w-[88%] xl:!max-w-[92%] 2xl:!max-w-[96%]">
                  {message.parts?.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return <Response key={i}>{part.text}</Response>;

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
                            if (toolUIPart.state === "output-error") return "error";
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
                              ? (toolUIPart.output as { data?: unknown[] })?.data
                              : undefined;
                          const errorMessage = toolUIPart.errorText;

                          return (
                            <div key={`${message.id}-tool-${i}`} className="mt-4">
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

          {isBusy && (
            <div className="mx-auto w-fit rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {isSubmitting ? "Sending…" : "Thinking…"}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton className="shadow-sm" />
      </Conversation>

      {/* Input Area */}
      <div className="border-t p-4">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Describe your hackathon…"
              className="min-h-[60px] w-full resize-none rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </PromptInputBody>
          <PromptInputToolbar className="mt-3 flex items-center justify-between">
            <div className="hidden sm:block text-xs text-muted-foreground">
              Press Enter to send — Shift+Enter for newline
            </div>
            <PromptInputSubmit
              disabled={!input.trim() || isBusy}
              status={status}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-primary-foreground shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isBusy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isBusy ? "Sending" : "Send"}
            </PromptInputSubmit>
          </PromptInputToolbar>
        </PromptInput>
      </div>
      </div>

      {/* Plan Sidebar */}
      <aside className="hidden lg:block border-l pl-4 pr-2 py-4 overflow-y-auto relative">
        <div className="space-y-4">
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">Venues</h3>
              <span className="text-xs text-muted-foreground">{selectedVenueId ? "1 selected" : "0 selected"}</span>
            </div>
            {plan.venues.length === 0 ? (
              <p className="text-xs text-muted-foreground">No venues yet</p>
            ) : (
              <ul className="space-y-2">
                {(plan.venues as any[]).slice(0, 5).map((v: any, i: number) => {
                  const id = v.id ?? String(i);
                  const selected = selectedVenueId === id;
                  return (
                    <li key={id} className={`rounded-md border p-2 text-sm transition-colors ${selected ? "border-primary bg-primary/5" : ""}`}>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="venue"
                          className="mt-0.5 h-4 w-4"
                          checked={selected}
                          onChange={() => setSelectedVenueId(id)}
                          aria-label={`Select venue ${v.name}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{v.name || "Venue"}</div>
                          <div className="text-xs text-muted-foreground truncate">{v.location || ""}</div>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">Judges</h3>
              <span className="text-xs text-muted-foreground">{selectedJudgeIds.size} selected</span>
            </div>
            {plan.judges.length === 0 ? (
              <p className="text-xs text-muted-foreground">No judges yet</p>
            ) : (
              <ul className="space-y-2">
                {(plan.judges as any[]).slice(0, 5).map((j: any, i: number) => {
                  const id = j.id ?? String(i);
                  const selected = selectedJudgeIds.has(id);
                  return (
                    <li key={id} className={`rounded-md border p-2 text-sm transition-colors ${selected ? "border-primary bg-primary/5" : ""}`}>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-0.5 h-4 w-4"
                          checked={selected}
                          onChange={() => toggleFromSet(setSelectedJudgeIds, id)}
                          aria-label={`Select judge ${j.name}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{j.name || "Judge"}</div>
                          <div className="text-xs text-muted-foreground truncate">{j.title || j.company || ""}</div>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">
                Sponsors
              </h3>
              <span className="text-xs text-muted-foreground">
                {selectedSponsorIds.size} selected
              </span>
            </div>
            {plan.sponsors.length === 0 ? (
              <p className="text-xs text-muted-foreground">No sponsors yet</p>
            ) : (
              <ul className="space-y-2">
                {(plan.sponsors as any[])
                  .slice(0, 5)
                  .map((s: any, i: number) => {
                    const id = s.id ?? String(i);
                    const selected = selectedSponsorIds.has(id);
                    return (
                      <li
                        key={id}
                        className={`rounded-md border p-2 text-sm transition-colors ${selected ? "border-primary bg-primary/5" : ""}`}
                      >
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4"
                            checked={selected}
                            onChange={() =>
                              toggleFromSet(setSelectedSponsorIds, id)
                            }
                            aria-label={`Select sponsor ${s.name}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {s.name || "Sponsor"}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {s.industry || s.location || ""}
                            </div>
                          </div>
                        </label>
                      </li>
                    );
                  })}
              </ul>
            )}
          </section>
        </div>

        {/* Create Luma CTA */}
        <div className="sticky bottom-0 mt-4 bg-background pt-3 pb-1 border-t">
          <button
            type="button"
            disabled={!canCreateLuma}
            onClick={() => {
              const id = `luma-${Date.now()}`;
              const name = "Hackathon Event";
              // Success toast via Sonner
              try {
                // Prefer success variant if available
                // @ts-ignore - success is available in sonner v2
                toast.success("Luma event created", {
                  description: `${name} (id: ${id})`,
                });
              } catch {
                toast("Luma event created: " + name + " (id: " + id + ")");
              }
              // Clear selections after success
              setSelectedVenueId(null);
              setSelectedJudgeIds(new Set());
              setSelectedSponsorIds(new Set());
            }}
            className={`w-full rounded-md px-3 py-2 text-sm font-medium shadow-sm transition-colors ${
              canCreateLuma
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {canCreateLuma
              ? "Create Luma Event"
              : "Select a venue and ≥1 judge"}
          </button>
        </div>
      </aside>
    </div>
  );
}
