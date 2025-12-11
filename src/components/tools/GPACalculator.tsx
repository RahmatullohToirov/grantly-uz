import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Plus, Trash2, GraduationCap } from "lucide-react";

interface GPACalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const gradePoints: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0,
};

export default function GPACalculator({ open, onOpenChange }: GPACalculatorProps) {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "", credits: 3, grade: "A" },
  ]);
  const [scale, setScale] = useState<"4.0" | "5.0" | "percentage">("4.0");

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", credits: 3, grade: "A" },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      if (course.grade && course.credits > 0) {
        const points = gradePoints[course.grade] || 0;
        totalPoints += points * course.credits;
        totalCredits += course.credits;
      }
    });

    if (totalCredits === 0) return 0;

    let gpa = totalPoints / totalCredits;

    if (scale === "5.0") {
      gpa = (gpa / 4.0) * 5.0;
    } else if (scale === "percentage") {
      gpa = (gpa / 4.0) * 100;
    }

    return gpa;
  };

  const getGPAColor = (gpa: number) => {
    if (scale === "percentage") {
      if (gpa >= 90) return "text-green-500";
      if (gpa >= 80) return "text-blue-500";
      if (gpa >= 70) return "text-yellow-500";
      return "text-red-500";
    }
    const normalizedGPA = scale === "5.0" ? (gpa / 5.0) * 4.0 : gpa;
    if (normalizedGPA >= 3.5) return "text-green-500";
    if (normalizedGPA >= 3.0) return "text-blue-500";
    if (normalizedGPA >= 2.5) return "text-yellow-500";
    return "text-red-500";
  };

  const gpa = calculateGPA();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            GPA Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {/* GPA Display */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <GraduationCap className="h-12 w-12 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Your GPA</p>
                  <p className={`text-5xl font-bold ${getGPAColor(gpa)}`}>
                    {gpa.toFixed(2)}
                    {scale === "percentage" && "%"}
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  variant={scale === "4.0" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScale("4.0")}
                >
                  4.0 Scale
                </Button>
                <Button
                  variant={scale === "5.0" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScale("5.0")}
                >
                  5.0 Scale
                </Button>
                <Button
                  variant={scale === "percentage" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScale("percentage")}
                >
                  Percentage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Courses */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Courses</h3>
              <Button onClick={addCourse} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>

            <div className="space-y-3">
              {courses.map((course, index) => (
                <Card key={course.id}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5">
                        <Label className="text-xs">Course Name</Label>
                        <Input
                          value={course.name}
                          onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                          placeholder={`Course ${index + 1}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Credits</Label>
                        <Input
                          type="number"
                          min="1"
                          max="6"
                          value={course.credits}
                          onChange={(e) => updateCourse(course.id, "credits", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Grade</Label>
                        <Select
                          value={course.grade}
                          onValueChange={(value) => updateCourse(course.id, "grade", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(gradePoints).map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade} ({gradePoints[grade]})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCourse(course.id)}
                          disabled={courses.length === 1}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Grade Scale Reference */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Grade Scale Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 text-sm">
                {Object.entries(gradePoints).map(([grade, points]) => (
                  <div key={grade} className="flex justify-between bg-muted/50 rounded px-2 py-1">
                    <span className="font-medium">{grade}</span>
                    <span className="text-muted-foreground">{points.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
