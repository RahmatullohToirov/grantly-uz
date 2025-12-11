import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Loader2, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";

interface EssayAnalyzerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

export default function EssayAnalyzer({ open, onOpenChange }: EssayAnalyzerProps) {
  const [essay, setEssay] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const analyzeEssay = async () => {
    if (!essay.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysis("");
    setScore(null);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Please analyze this scholarship essay and provide detailed feedback:\n\n${essay}`,
            },
          ],
          type: "essay-analyzer",
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullAnalysis = "";

      if (!reader) throw new Error("No reader");

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
                fullAnalysis += content;
                setAnalysis(fullAnalysis);
              }
            } catch {}
          }
        }
      }

      // Extract score from analysis
      const scoreMatch = fullAnalysis.match(/(\d{1,3})(?:\s*\/\s*100|\s*out of\s*100)/i);
      if (scoreMatch) {
        setScore(parseInt(scoreMatch[1]));
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysis("Sorry, there was an error analyzing your essay. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const wordCount = essay.split(/\s+/).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">AI Essay Analyzer</span>
              <p className="text-sm text-muted-foreground font-normal">Get detailed feedback on your essay</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Input Panel */}
          <div className="w-1/2 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold">Your Essay</h3>
              <span className="text-sm text-muted-foreground">{wordCount} words</span>
            </div>
            <div className="flex-1 p-4">
              <Textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="Paste your scholarship essay here for analysis..."
                className="h-full resize-none"
              />
            </div>
            <div className="p-4 border-t border-border">
              <Button
                onClick={analyzeEssay}
                disabled={!essay.trim() || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Essay
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="w-1/2 flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Analysis Results</h3>
            </div>
            <ScrollArea className="flex-1 p-4">
              {!analysis && !isAnalyzing ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <Brain className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                    <p className="text-muted-foreground">
                      Paste your essay and click analyze to get AI-powered feedback.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {score !== null && (
                    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Overall Score</span>
                          <span className="text-2xl font-bold text-primary">{score}/100</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardContent className="p-4">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{analysis}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
