import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface CommunityPost {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  likes_count: number;
  author?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  comments?: CommunityComment[];
  user_has_liked?: boolean;
}

export interface CommunityComment {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  created_at: string;
  author?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const useCommunityPosts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all posts with author info and comments
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ["community-posts"],
    queryFn: async () => {
      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) return [];

      // Get unique author IDs
      const authorIds = [...new Set(postsData.map((p) => p.author_id))];

      // Fetch profiles for all authors
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", authorIds);

      // Fetch all comments for these posts
      const postIds = postsData.map((p) => p.id);
      const { data: commentsData } = await supabase
        .from("community_comments")
        .select("*")
        .in("post_id", postIds)
        .order("created_at", { ascending: true });

      // Fetch comment author profiles
      const commentAuthorIds = commentsData 
        ? [...new Set(commentsData.map((c) => c.author_id))]
        : [];
      
      const { data: commentProfiles } = commentAuthorIds.length > 0
        ? await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .in("id", commentAuthorIds)
        : { data: [] };

      // Fetch user's likes if logged in
      let userLikes: string[] = [];
      if (user) {
        const { data: likesData } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", user.id);
        userLikes = likesData?.map((l) => l.post_id) || [];
      }

      // Map data together
      const profilesMap = new Map<string, { id: string; full_name: string | null; avatar_url: string | null }>();
      profiles?.forEach((p) => profilesMap.set(p.id, p));
      
      const commentProfilesMap = new Map<string, { id: string; full_name: string | null; avatar_url: string | null }>();
      commentProfiles?.forEach((p) => commentProfilesMap.set(p.id, p));

      const postsWithData: CommunityPost[] = postsData.map((post) => {
        const author = profilesMap.get(post.author_id) || { 
          id: post.author_id, 
          full_name: "Anonymous", 
          avatar_url: null 
        };
        
        const postComments: CommunityComment[] = (commentsData || [])
          .filter((c) => c.post_id === post.id)
          .map((c) => {
            const commentAuthor = commentProfilesMap.get(c.author_id) || {
              id: c.author_id,
              full_name: "Anonymous",
              avatar_url: null,
            };
            return {
              ...c,
              author: commentAuthor,
            };
          });

        return {
          ...post,
          likes_count: post.likes_count || 0,
          author,
          comments: postComments,
          user_has_liked: userLikes.includes(post.id),
        };
      });

      return postsWithData;
    },
  });

  // Create a new post
  const createPost = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Must be logged in to post");

      const { data, error } = await supabase
        .from("community_posts")
        .insert({
          content: content.trim(),
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Like a post
  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("Must be logged in to like");

      const { error } = await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: user.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    },
    onError: (error) => {
      console.error("Error liking post:", error);
    },
  });

  // Unlike a post
  const unlikePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("Must be logged in to unlike");

      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    },
    onError: (error) => {
      console.error("Error unliking post:", error);
    },
  });

  // Add a comment
  const addComment = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!user) throw new Error("Must be logged in to comment");

      const { data, error } = await supabase
        .from("community_comments")
        .insert({
          post_id: postId,
          content: content.trim(),
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
      });
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete a post
  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("Must be logged in to delete");

      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", postId)
        .eq("author_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    posts: posts || [],
    isLoading,
    error,
    refetch,
    createPost,
    likePost,
    unlikePost,
    addComment,
    deletePost,
  };
};
