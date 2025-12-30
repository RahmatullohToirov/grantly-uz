import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useCommunityPosts, CommunityPost } from "@/hooks/useCommunityPosts";
import { formatDistanceToNow } from "date-fns";
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Send,
  Trash2,
  Heart
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCardProps {
  post: CommunityPost;
}

const PostCard = ({ post }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();
  const { likePost, unlikePost, addComment, deletePost } = useCommunityPosts();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLike = () => {
    if (!user) return;
    if (post.user_has_liked) {
      unlikePost.mutate(post.id);
    } else {
      likePost.mutate(post.id);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    addComment.mutate({ postId: post.id, content: commentText });
    setCommentText("");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost.mutate(post.id);
    }
  };

  const isOwner = user?.id === post.author_id;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-elegant transition-all duration-300 animate-fade-in">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-primary/10">
            <AvatarImage src={post.author?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(post.author?.full_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-card-foreground">
                  {post.author?.full_name || "Anonymous"}
                </span>
                <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                  Scholar
                </Badge>
                <span className="text-sm text-muted-foreground">
                  · {timeAgo}
                </span>
              </div>
              
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="text-card-foreground mb-4 whitespace-pre-wrap break-words">
              {post.content}
            </p>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`hover-scale ${post.user_has_liked ? 'text-primary' : ''}`}
                onClick={handleLike}
                disabled={!user}
              >
                <Heart className={`h-4 w-4 mr-1 ${post.user_has_liked ? 'fill-primary' : ''}`} />
                <span className="hidden sm:inline">{post.likes_count}</span>
                <span className="sm:hidden">{post.likes_count}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover-scale"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{post.comments?.length || 0}</span>
                <span className="sm:hidden">{post.comments?.length || 0}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="hover-scale">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-3">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.author?.avatar_url || undefined} />
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                            {getInitials(comment.author?.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-card-foreground">
                              {comment.author?.full_name || "Anonymous"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-card-foreground">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {user ? (
                  <form onSubmit={handleComment} className="flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1"
                      maxLength={500}
                    />
                    <Button 
                      type="submit" 
                      size="sm"
                      disabled={!commentText.trim() || addComment.isPending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Sign in to leave a comment
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <Card className="bg-card/80 backdrop-blur-sm border-border">
    <CardContent className="p-6">
      <div className="flex gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CommunityFeed = () => {
  const { posts, isLoading, error } = useCommunityPosts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Failed to load posts. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            No posts yet
          </h3>
          <p className="text-muted-foreground">
            Be the first to share something with the community!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default CommunityFeed;
