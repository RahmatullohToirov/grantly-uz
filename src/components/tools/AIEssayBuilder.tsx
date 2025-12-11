import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, PenTool, Loader2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIEssayBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

export default function AIEssayBuilder({ open, onOpenChange }: AIEssayBuilderProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI Essay Builder. I can help you brainstorm ideas, create outlines, write drafts, and polish your scholarship essays. What type of essay are you working on?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [essayPrompt, setEssayPrompt] = useState("");
  const [essayDraft, setEssayDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages.filter(m => m.id !== "welcome"), userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          type: "essay-builder",
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last?.role === "assistant" && last.id !== "welcome") {
                    return prev.map((m, i) =>
                      i === prev.length - 1 ? { ...m, content: assistantContent } : m
                    );
                  }
                  return [...prev, { id: Date.now().toString(), role: "assistant", content: assistantContent }];
                });
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const lastAssistantMessage = messages.filter(m => m.role === "assistant").pop();
    if (lastAssistantMessage) {
      await navigator.clipboard.writeText(lastAssistantMessage.content);
      setCopied(true);
      toast({ title: "Copied!", description: "Essay content copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <PenTool className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">AI Essay Builder</span>
              <p className="text-sm text-muted-foreground font-normal">Craft compelling scholarship essays</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b border-border px-6 h-12">
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
            <TabsTrigger value="workspace">Essay Workspace</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden">
            <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className={`h-8 w-8 ${message.role === "assistant" ? "bg-gradient-to-br from-purple-500 to-pink-500" : "bg-muted"}`}>
                      <AvatarFallback className={message.role === "assistant" ? "bg-transparent text-white" : ""}>
                        {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground border border-border"
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500">
                      <AvatarFallback className="bg-transparent text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/50 rounded-2xl px-4 py-3 border border-border">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for help with your essay..."
                  className="min-h-[60px] max-h-[120px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="icon" className="h-[28px] w-[60px] rounded-xl">
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-[28px] w-[60px] rounded-xl" onClick={copyToClipboard}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workspace" className="flex-1 flex flex-col m-0 p-6 data-[state=inactive]:hidden">
            <div className="space-y-4 flex-1 flex flex-col">
              <div>
                <Label>Essay Prompt</Label>
                <Textarea
                  value={essayPrompt}
                  onChange={(e) => setEssayPrompt(e.target.value)}
                  placeholder="Paste the scholarship essay prompt here..."
                  className="mt-2 min-h-[80px]"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <Label>Your Essay Draft</Label>
                <Textarea
                  value={essayDraft}
                  onChange={(e) => setEssayDraft(e.target.value)}
                  placeholder="Start writing your essay here..."
                  className="mt-2 flex-1 min-h-[200px]"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{essayDraft.split(/\s+/).filter(Boolean).length} words</span>
                <span>{essayDraft.length} characters</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
