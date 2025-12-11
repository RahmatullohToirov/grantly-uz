import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  useApplicationChecklist, 
  useCreateChecklist, 
  useUpdateChecklistItem,
  useAddChecklistItem,
  useDeleteChecklistItem 
} from "@/hooks/useApplicationChecklist";
import { ClipboardList, Plus, Trash2, Loader2 } from "lucide-react";

interface ApplicationChecklistCardProps {
  scholarshipId: string;
  scholarshipTitle: string;
}

export const ApplicationChecklistCard = ({ scholarshipId, scholarshipTitle }: ApplicationChecklistCardProps) => {
  const { data: checklist, isLoading } = useApplicationChecklist(scholarshipId);
  const createChecklist = useCreateChecklist();
  const updateItem = useUpdateChecklistItem();
  const addItem = useAddChecklistItem();
  const deleteItem = useDeleteChecklistItem();

  const [newItemLabel, setNewItemLabel] = useState('');

  const handleCreateChecklist = () => {
    createChecklist.mutate({ scholarshipId });
  };

  const handleToggleItem = (itemId: string, completed: boolean) => {
    if (!checklist) return;
    updateItem.mutate({
      checklistId: checklist.id,
      scholarshipId,
      itemId,
      updates: { completed },
    });
  };

  const handleAddItem = () => {
    if (!checklist || !newItemLabel.trim()) return;
    addItem.mutate({
      checklistId: checklist.id,
      scholarshipId,
      item: { label: newItemLabel.trim(), completed: false },
    });
    setNewItemLabel('');
  };

  const handleDeleteItem = (itemId: string) => {
    if (!checklist) return;
    deleteItem.mutate({
      checklistId: checklist.id,
      scholarshipId,
      itemId,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!checklist) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5" />
            Application Checklist
          </CardTitle>
          <CardDescription>
            Track required documents for {scholarshipTitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleCreateChecklist} 
            disabled={createChecklist.isPending}
            className="w-full"
          >
            {createChecklist.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Create Checklist
          </Button>
        </CardContent>
      </Card>
    );
  }

  const completedCount = checklist.checklist_items.filter(i => i.completed).length;
  const totalCount = checklist.checklist_items.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="h-5 w-5" />
          Application Checklist
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{completedCount} of {totalCount} items completed</span>
          <span className="font-medium">{progress}%</span>
        </CardDescription>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {checklist.checklist_items.map(item => (
          <div 
            key={item.id} 
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Checkbox
              checked={item.completed}
              onCheckedChange={(checked) => handleToggleItem(item.id, checked as boolean)}
              disabled={updateItem.isPending}
            />
            <span className={`flex-1 text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
              {item.label}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteItem(item.id)}
              disabled={deleteItem.isPending}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="flex gap-2 pt-2 border-t">
          <Input
            placeholder="Add custom item..."
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            className="flex-1"
          />
          <Button 
            onClick={handleAddItem} 
            disabled={!newItemLabel.trim() || addItem.isPending}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
