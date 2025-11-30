"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Plus, 
  Search, 
  User,
  BookOpen,
  Star,
  Edit,
  Trash2,
  MoreVertical,
  Video,
  Music,
  FileText,
  Image as ImageIcon,
  File,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { api, parseResponse } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Orator {
  _id: string;
  name: string;
  thumbNail?: string;
}

interface Subject {
  _id: string;
  author: string;
  subjectName: string;
  categoryIds: string[];
  categories: string[];
}

interface TopicMaster {
  _id: string;
  topicName: string;
  subjectId: string;
  oratorId: string;
  topicType: string;
  status: string;
  featured: boolean;
  thumbNail?: string;
  active?: boolean;
  lastUpdateDate?: string;
  attachments?: Array<{
    _id: string;
    title: string;
    fileUrl?: string;
    type?: string;
    order?: number;
  }>;
  overview?: string;
  orator: Orator;
  subject: Subject;
  updatedAt?: string;
}

const getTopicTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "video":
      return Video;
    case "audio":
      return Music;
    case "article":
      return FileText;
    case "poster":
      return ImageIcon;
    case "document":
      return File;
    default:
      return FileText;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "ongoing":
      return "bg-blue-100 text-blue-700";
    case "upcoming":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function TopicMasterPage() {
  const [topics, setTopics] = useState<TopicMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/topic_master?limit=10&page=${page}`);
      const data = await parseResponse<TopicMaster[]>(response);
      setTopics(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = topics.filter((topic) =>
    topic.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.orator?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.subject?.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.topicType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredCount = topics.filter((t) => t.featured).length;
  const completedCount = topics.filter((t) => t.status === "Completed").length;
  const totalAttachments = topics.reduce((sum, t) => sum + (t.attachments?.length || 0), 0);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4 ml-12 lg:ml-0">
            <h1 className="text-2xl font-bold text-gray-900">Topic Master</h1>
            <Badge variant="secondary" className="text-xs">
              {topics.length} topics
            </Badge>
          </div>
          <Link href="/admin/master/topic-master/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Topic
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
              placeholder="Search topics, orators, subjects, status..."
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
                  <p className="text-xs font-medium text-muted-foreground">Total Topics</p>
                  <p className="text-xl font-bold text-foreground mt-1">{topics.length}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Featured</p>
                  <p className="text-xl font-bold text-foreground mt-1">{featuredCount}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold text-foreground mt-1">{completedCount}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Attachments</p>
                  <p className="text-xl font-bold text-foreground mt-1">{totalAttachments}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                  <File className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topics Table */}
        {loading ? (
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/6" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : filteredTopics.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No topics found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search query" : "Get started by creating your first topic"}
              </p>
              {!searchQuery && (
                <Link href="/admin/master/topic-master/add">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Topic
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Topic Name</TableHead>
                    <TableHead>Orator</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Featured</TableHead>
                    <TableHead className="text-center">Attachments</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTopics.map((topic, index) => {
                    const TypeIcon = getTopicTypeIcon(topic.topicType);
                    return (
                      <TableRow key={topic._id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-muted-foreground">
                          {(page - 1) * 10 + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {topic.thumbNail ? (
                              <div className="relative h-10 w-10 rounded-lg overflow-hidden">
                                <Image
                                  src={topic.thumbNail}
                                  alt={topic.topicName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Lightbulb className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-foreground">{topic.topicName}</div>
                              <div className="text-xs text-muted-foreground">ID: {topic._id.slice(-8)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {topic.orator?.thumbNail ? (
                              <div className="relative h-8 w-8 rounded-full overflow-hidden">
                                <Image
                                  src={topic.orator.thumbNail}
                                  alt={topic.orator.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <User className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm font-medium">{topic.orator?.name || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">{topic.subject?.subjectName || "N/A"}</div>
                              {topic.subject?.author && (
                                <div className="text-xs text-muted-foreground">by {topic.subject.author}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            <TypeIcon className="h-3 w-3" />
                            {topic.topicType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(topic.status)}>
                            {topic.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {topic.featured ? (
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 inline" />
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="font-mono">
                            {topic.attachments?.length || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => window.location.href = `/admin/master/topic-master/edit/${topic._id}`}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Topic
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Topic
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {!loading && filteredTopics.length > 0 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {page}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={topics.length < 10}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
