import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles,
  Eye,
  Scale,
  PenTool,
  Calendar,
  Brain,
  Calculator,
  Search
} from "lucide-react";
import AIApplicationAdviser from "@/components/tools/AIApplicationAdviser";
import ScholarshipComparisonTool from "@/components/tools/ScholarshipComparisonTool";
import AIEssayBuilder from "@/components/tools/AIEssayBuilder";
import ApplicationTracker from "@/components/tools/ApplicationTracker";
import EssayAnalyzer from "@/components/tools/EssayAnalyzer";
import GPACalculator from "@/components/tools/GPACalculator";
import ScholarshipFinder from "@/components/tools/ScholarshipFinder";
import ScholarshipShadowMode from "@/components/tools/ScholarshipShadowMode";

const Resources = () => {
  const [openTool, setOpenTool] = useState<string | null>(null);

  const quickTools = [
    { name: "AI Application Adviser", description: "Chat with AI for guidance", icon: Sparkles, color: "bg-gradient-to-br from-primary/20 to-secondary/20 text-primary", toolKey: "adviser" },
    { name: "Scholarship Shadow Mode", description: "Rehearse applications privately", icon: Eye, color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400", toolKey: "shadow-mode" },
    { name: "Scholarship Comparison", description: "Compare scholarships side-by-side", icon: Scale, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400", toolKey: "comparison" },
    { name: "AI Essay Builder", description: "Build compelling essays", icon: PenTool, color: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400", toolKey: "essay-builder" },
    { name: "Application Tracker", description: "Track deadlines and progress", icon: Calendar, color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400", toolKey: "tracker" },
    { name: "Essay Analyzer", description: "AI-powered essay feedback", icon: Brain, color: "bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400", toolKey: "essay-analyzer" },
    { name: "GPA Calculator", description: "Calculate and convert grades", icon: Calculator, color: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400", toolKey: "gpa" },
    { name: "Scholarship Finder", description: "Personalized recommendations", icon: Search, color: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400", toolKey: "finder" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Resources</h1>
          <p className="text-muted-foreground">
            Essential tools to streamline your scholarship journey
          </p>
        </div>

        {/* Quick Tools */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Access Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {quickTools.map((tool, index) => (
              <Card 
                key={index} 
                className="bg-card border-border hover:shadow-soft transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
                onClick={() => setOpenTool(tool.toolKey)}
              >
                <CardContent className="p-4 md:p-6 text-center">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${tool.color} flex items-center justify-center mx-auto mb-3 md:mb-4`}>
                    <tool.icon className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-1 md:mb-2 text-sm md:text-base">
                    {tool.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Tool Dialogs */}
      <AIApplicationAdviser open={openTool === "adviser"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <ScholarshipShadowMode open={openTool === "shadow-mode"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <ScholarshipComparisonTool open={openTool === "comparison"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <AIEssayBuilder open={openTool === "essay-builder"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <ApplicationTracker open={openTool === "tracker"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <EssayAnalyzer open={openTool === "essay-analyzer"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <GPACalculator open={openTool === "gpa"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <ScholarshipFinder open={openTool === "finder"} onOpenChange={(open) => !open && setOpenTool(null)} />
      
      <ChatBot />
    </div>
  );
};

export default Resources;
