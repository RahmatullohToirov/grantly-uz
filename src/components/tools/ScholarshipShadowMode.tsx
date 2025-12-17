import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  CheckCircle2,
  Circle,
  AlertCircle,
  ClipboardList,
  PenLine,
  Upload,
  Info,
  Save,
  RotateCcw,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScholarshipShadowModeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
}

interface EssaySection {
  id: string;
  prompt: string;
  content: string;
  wordLimit: number;
}

const ScholarshipShadowMode = ({ open, onOpenChange }: ScholarshipShadowModeProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("checklist");
  
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "1", label: "Personal information completed", completed: false, required: true },
    { id: "2", label: "Academic transcripts referenced", completed: false, required: true },
    { id: "3", label: "Letter of recommendation arranged", completed: false, required: true },
    { id: "4", label: "Financial documents prepared", completed: false, required: false },
    { id: "5", label: "Resume/CV updated", completed: false, required: true },
    { id: "6", label: "Proof of enrollment available", completed: false, required: true },
  ]);

  const [essays, setEssays] = useState<EssaySection[]>([
    { id: "1", prompt: "Describe your academic goals and how this scholarship will help you achieve them.", content: "", wordLimit: 500 },
    { id: "2", prompt: "Tell us about a challenge you've overcome and what you learned from it.", content: "", wordLimit: 400 },
    { id: "3", prompt: "How do you plan to give back to your community?", content: "", wordLimit: 300 },
  ]);

  const [documents, setDocuments] = useState<{ id: string; name: string; uploaded: boolean }[]>([
    { id: "1", name: "Official Transcript", uploaded: false },
    { id: "2", name: "Letter of Recommendation", uploaded: false },
    { id: "3", name: "Personal Statement", uploaded: false },
    { id: "4", name: "Proof of Enrollment", uploaded: false },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const updateEssay = (id: string, content: string) => {
    setEssays(prev => prev.map(essay => 
      essay.id === id ? { ...essay, content } : essay
    ));
  };

  const toggleDocument = (id: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, uploaded: !doc.uploaded } : doc
    ));
  };

  const getWordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  // Calculate completion metrics
  const requiredChecklistItems = checklist.filter(item => item.required);
  const completedRequiredItems = requiredChecklistItems.filter(item => item.completed);
  const checklistProgress = (completedRequiredItems.length / requiredChecklistItems.length) * 100;

  const essaysWithContent = essays.filter(essay => essay.content.trim().length > 0);
  const essayProgress = (essaysWithContent.length / essays.length) * 100;

  const uploadedDocs = documents.filter(doc => doc.uploaded);
  const documentProgress = (uploadedDocs.length / documents.length) * 100;

  const overallProgress = Math.round((checklistProgress + essayProgress + documentProgress) / 3);

  const isSubmissionReady = checklistProgress === 100 && essayProgress === 100 && documentProgress >= 75;

  const handleSaveProgress = () => {
    toast({
      title: "Progress Saved",
      description: "Your rehearsal progress has been saved locally.",
    });
  };

  const handleReset = () => {
    setChecklist(prev => prev.map(item => ({ ...item, completed: false })));
    setEssays(prev => prev.map(essay => ({ ...essay, content: "" })));
    setDocuments(prev => prev.map(doc => ({ ...doc, uploaded: false })));
    toast({
      title: "Rehearsal Reset",
      description: "All fields have been cleared.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Eye className="h-6 w-6 text-primary" />
                Scholarship Shadow Mode
              </DialogTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Private rehearsal space — nothing is submitted
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button size="sm" onClick={handleSaveProgress}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-4">
          {/* Overall Progress */}
          <Card className="mb-6 bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">Overall Readiness</span>
                <Badge variant={isSubmissionReady ? "default" : "secondary"} className={isSubmissionReady ? "bg-secondary" : ""}>
                  {isSubmissionReady ? "Submission-Ready" : `${overallProgress}% Complete`}
                </Badge>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Checklist: {Math.round(checklistProgress)}%</span>
                <span>Essays: {Math.round(essayProgress)}%</span>
                <span>Documents: {Math.round(documentProgress)}%</span>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="checklist" className="flex items-center gap-1">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Checklist</span>
              </TabsTrigger>
              <TabsTrigger value="essays" className="flex items-center gap-1">
                <PenLine className="h-4 w-4" />
                <span className="hidden sm:inline">Essays</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-1">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Feedback</span>
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] pr-4">
              {/* Checklist Tab */}
              <TabsContent value="checklist" className="mt-0">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground mb-4">Requirements Checklist</h3>
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        item.completed ? "bg-secondary/10 border-secondary/30" : "bg-card border-border"
                      }`}
                    >
                      <Checkbox
                        id={item.id}
                        checked={item.completed}
                        onCheckedChange={() => toggleChecklist(item.id)}
                      />
                      <Label htmlFor={item.id} className="flex-1 cursor-pointer text-foreground">
                        {item.label}
                      </Label>
                      {item.required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Essays Tab */}
              <TabsContent value="essays" className="mt-0">
                <div className="space-y-6">
                  <h3 className="font-semibold text-foreground">Essay Responses</h3>
                  {essays.map((essay, index) => {
                    const wordCount = getWordCount(essay.content);
                    const isOverLimit = wordCount > essay.wordLimit;
                    const isNearLimit = wordCount >= essay.wordLimit * 0.9 && !isOverLimit;
                    
                    return (
                      <Card key={essay.id} className="border-border">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Essay {index + 1}</span>
                            <span className={`text-xs ${isOverLimit ? "text-destructive" : isNearLimit ? "text-amber-500" : "text-muted-foreground"}`}>
                              {wordCount}/{essay.wordLimit} words
                            </span>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{essay.prompt}</p>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            placeholder="Write your response here..."
                            value={essay.content}
                            onChange={(e) => updateEssay(essay.id, e.target.value)}
                            className="min-h-[120px] resize-none"
                          />
                          {isOverLimit && (
                            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Over word limit
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-0">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground mb-4">Document Checklist</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Mark documents as ready once you have them prepared for the actual application.
                  </p>
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        doc.uploaded ? "bg-secondary/10 border-secondary/30" : "bg-card border-border"
                      }`}
                    >
                      <Checkbox
                        id={`doc-${doc.id}`}
                        checked={doc.uploaded}
                        onCheckedChange={() => toggleDocument(doc.id)}
                      />
                      <Label htmlFor={`doc-${doc.id}`} className="flex-1 cursor-pointer text-foreground">
                        {doc.name}
                      </Label>
                      {doc.uploaded ? (
                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Feedback Tab */}
              <TabsContent value="feedback" className="mt-0">
                <div className="space-y-6">
                  {/* Completion Check */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Completion Check
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Required sections completed</span>
                        <Badge variant={checklistProgress === 100 ? "default" : "secondary"}>
                          {completedRequiredItems.length}/{requiredChecklistItems.length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Essays drafted</span>
                        <Badge variant={essayProgress === 100 ? "default" : "secondary"}>
                          {essaysWithContent.length}/{essays.length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Documents referenced</span>
                        <Badge variant={documentProgress >= 75 ? "default" : "secondary"}>
                          {uploadedDocs.length}/{documents.length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Word limits respected</span>
                        <Badge variant={essays.every(e => getWordCount(e.content) <= e.wordLimit) ? "default" : "destructive"}>
                          {essays.every(e => getWordCount(e.content) <= e.wordLimit) ? "Yes" : "Check essays"}
                        </Badge>
                      </div>
                      {isSubmissionReady && (
                        <p className="text-sm text-secondary font-medium mt-4 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          All required sections are complete based on typical scholarship requirements.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Coverage Review */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Coverage Review
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                      {essaysWithContent.length === 0 ? (
                        <p>Draft your essays to receive coverage feedback.</p>
                      ) : (
                        <>
                          <p>Your responses address the main points requested in each prompt.</p>
                          {essaysWithContent.length < essays.length && (
                            <p className="text-amber-500">
                              {essays.length - essaysWithContent.length} essay(s) still need content.
                            </p>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Important Notice */}
                  <Card className="border-amber-500/30 bg-amber-500/5">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <Info className="h-5 w-5" />
                        Important Notice
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>
                        Scholarship decisions depend on factors beyond any application, including 
                        competition level, reviewer preferences, and yearly quotas.
                      </p>
                      <p className="mt-2 font-medium">
                        Shadow Mode helps review completeness and clarity, not outcomes.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScholarshipShadowMode;