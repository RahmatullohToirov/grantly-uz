import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { Send, ImageIcon, Link2, Smile } from "lucide-react";

const CreatePostForm = () => {
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { createPost } = useCommunityPosts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    await createPost.mutateAsync(content);
    setContent("");
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Sign in to share your thoughts with the community
          </p>
          <Button variant="default" onClick={() => window.location.href = "/"}>
            Sign In to Post
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border shadow-soft">
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-primary/20 hidden sm:flex">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your scholarship journey, ask for advice, or celebrate a win..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-border/50 focus:border-primary bg-background/50"
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Link2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {content.length}/1000
                  </span>
                  <Button
                    type="submit"
                    disabled={!content.trim() || createPost.isPending}
                    className="hover-scale"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {createPost.isPending ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
