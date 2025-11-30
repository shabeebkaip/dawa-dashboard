"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Search, 
  Music2, 
  Tag,
  Clock,
  ChevronRight,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api, parseResponse } from "@/lib/api";

interface Content {
  _id: string;
  title: string;
  startingDuration: number;
}

interface Post {
  _id: string;
  topicMasterId: string;
  postTitle: string;
  postDescription: string;
  fileURL: string;
  partNo: number;
  tags: string[];
  contents: Content[];
  duration: number;
  active: boolean;
  date: string;
  createdAt?: string;
  updatedAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/posts");
      const data = await parseResponse<Post[]>(response);
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const filteredPosts = posts.filter((post) =>
    post.postTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.postDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCount = posts.filter((p) => p.active).length;
  const totalDuration = posts.reduce((sum, p) => sum + p.duration, 0);
  const totalContents = posts.reduce((sum, p) => sum + p.contents.length, 0);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4 ml-12 lg:ml-0">
            <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
            <Badge variant="secondary" className="text-xs">
              {posts.length} posts
            </Badge>
          </div>
          <Link href="/admin/posts/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 lg:p-8 space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts, tags, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Posts</p>
                  <p className="text-xl font-bold text-foreground mt-1">{posts.length}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Active Posts</p>
                  <p className="text-xl font-bold text-foreground mt-1">{activeCount}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Duration</p>
                  <p className="text-xl font-bold text-foreground mt-1">{formatDuration(totalDuration)}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Contents</p>
                  <p className="text-xl font-bold text-foreground mt-1">{totalContents}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                  <Layers className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardContent className="p-0">
                  <div className="h-32 bg-gray-200 animate-pulse rounded-t-lg" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try adjusting your search query" : "Get started by creating your first post"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredPosts.map((post) => (
              <Card
                key={post._id}
                className="group shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border-0"
              >
                <CardContent className="p-0">
                  {/* Post Header */}
                  <div className="relative h-32 bg-linear-to-br from-primary via-emerald-500 to-teal-500 overflow-hidden">
                    <div className="flex items-center justify-center h-full">
                      <Music2 className="h-12 w-12 text-white/30" />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge 
                        variant={post.active ? "default" : "secondary"}
                        className={post.active ? "bg-green-500" : "bg-gray-500"}
                      >
                        {post.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {/* Part Number */}
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2 text-white">
                        <div className="flex flex-col items-center bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 border border-white/30">
                          <span className="text-xs font-medium">Part</span>
                          <span className="text-xl font-bold">{post.partNo}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Details */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.postTitle}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.postDescription}
                      </p>

                      {/* Duration and Contents */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium">{formatDuration(post.duration)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-primary" />
                          <span className="font-medium">{post.contents.length} contents</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs px-2 py-0.5"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Date */}
                      <div className="text-xs text-muted-foreground">
                        Updated {new Date(post.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        className="w-full justify-between hover:bg-primary hover:text-white transition-colors"
                        onClick={() => window.location.href = `/admin/posts/edit/${post._id}`}
                      >
                        <span>Edit Post</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
