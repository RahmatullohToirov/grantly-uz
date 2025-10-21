import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  MessageCircle, 
  ThumbsUp,
  Share2,
  Send
} from "lucide-react";

interface Post {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  likes_count: number;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface Comment {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
    
    // Set up real-time subscription for new posts
    const channel = supabase
      .channel('community-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts'
        },
        () => fetchPosts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load community posts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(prev => ({ ...prev, [postId]: data || [] }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const createPost = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post.",
        variant: "destructive",
      });
      return;
    }

    if (!newPost.trim()) return;

    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          content: newPost,
          author_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Post Created",
        description: "Your post has been shared with the community!",
      });

      setNewPost("");
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (error) throw error;
      }

      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const addComment = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment.",
        variant: "destructive",
      });
      return;
    }

    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    try {
      const { error } = await supabase
        .from('community_comments')
        .insert({
          content: commentText,
          author_id: user.id,
          post_id: postId
        });

      if (error) throw error;

      toast({
        title: "Comment Added",
        description: "Your comment has been posted!",
      });

      setNewComment(prev => ({ ...prev, [postId]: "" }));
      fetchComments(postId);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleComments = (postId: string) => {
    if (comments[postId]) {
      const newComments = { ...comments };
      delete newComments[postId];
      setComments(newComments);
    } else {
      fetchComments(postId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">Community</h1>

          {/* Create Post */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <Textarea
                placeholder="Share your scholarship journey, ask questions, or celebrate wins..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
                className="mb-4"
              />
              <Button onClick={createPost} disabled={!newPost.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar>
                        {post.profiles?.avatar_url ? (
                          <AvatarImage src={post.profiles.avatar_url} />
                        ) : (
                          <AvatarFallback>
                            {post.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-card-foreground">
                          {post.profiles?.full_name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <p className="text-card-foreground mb-4">{post.content}</p>

                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {post.likes_count}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleComments(post.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Comments
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>

                    {/* Comments Section */}
                    {comments[post.id] && (
                      <div className="mt-6 space-y-4 border-t pt-4">
                        {comments[post.id].map((comment) => (
                          <div key={comment.id} className="flex items-start space-x-3">
                            <Avatar className="w-8 h-8">
                              {comment.profiles?.avatar_url ? (
                                <AvatarImage src={comment.profiles.avatar_url} />
                              ) : (
                                <AvatarFallback className="text-xs">
                                  {comment.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1">
                              <div className="text-sm font-semibold">
                                {comment.profiles?.full_name || 'Anonymous'}
                              </div>
                              <p className="text-sm text-muted-foreground">{comment.content}</p>
                            </div>
                          </div>
                        ))}

                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Add a comment..."
                            value={newComment[post.id] || ""}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                          />
                          <Button
                            size="sm"
                            onClick={() => addComment(post.id)}
                            disabled={!newComment[post.id]?.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <ChatBot />
    </div>
  );
};

export default Community;
