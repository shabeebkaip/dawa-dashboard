"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Plus, 
  Search, 
  User,
  FolderTree,
  Network,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Link from "next/link";
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

interface SubjectMaster {
  _id: string;
  author: string;
  subjectName: string;
  categoryIds: (string | null)[];
  subCategoryIds: string[];
  categories: (string | null)[];
  subCategories: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function SubjectMasterPage() {
  const [subjects, setSubjects] = useState<SubjectMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/subject_master?limit=10&page=${page}`);
      const data = await parseResponse<SubjectMaster[]>(response);
      setSubjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.categories.some(cat => cat?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    subject.subCategories.some(subCat => subCat?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const withCategories = subjects.filter((s) => s.categories.filter(Boolean).length > 0).length;
  const totalCategories = subjects.reduce((sum, s) => sum + s.categories.filter(Boolean).length, 0);
  const totalSubCategories = subjects.reduce((sum, s) => sum + s.subCategories.filter(Boolean).length, 0);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4 ml-12 lg:ml-0">
            <h1 className="text-2xl font-bold text-gray-900">Subject Master</h1>
            <Badge variant="secondary" className="text-xs">
              {subjects.length} subjects
            </Badge>
          </div>
          <Link href="/admin/master/subject-master/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Subject
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
              placeholder="Search subjects, authors, categories..."
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
                  <p className="text-xs font-medium text-muted-foreground">Total Subjects</p>
                  <p className="text-xl font-bold text-foreground mt-1">{subjects.length}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">With Categories</p>
                  <p className="text-xl font-bold text-foreground mt-1">{withCategories}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                  <FolderTree className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Categories</p>
                  <p className="text-xl font-bold text-foreground mt-1">{totalCategories}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                  <FolderTree className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Sub Categories</p>
                  <p className="text-xl font-bold text-foreground mt-1">{totalSubCategories}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                  <Network className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Table */}
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
        ) : filteredSubjects.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No subjects found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search query" : "Get started by creating your first subject"}
              </p>
              {!searchQuery && (
                <Link href="/admin/master/subject-master/add">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Subject
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
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Sub Categories</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject, index) => (
                    <TableRow key={subject._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-muted-foreground">
                        {(page - 1) * 10 + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{subject.subjectName}</div>
                            <div className="text-xs text-muted-foreground">ID: {subject._id.slice(-8)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{subject.author}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subject.categories.filter(Boolean).length > 0 ? (
                            <>
                              {subject.categories.filter(Boolean).slice(0, 2).map((cat, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  <FolderTree className="h-3 w-3 mr-1" />
                                  {cat}
                                </Badge>
                              ))}
                              {subject.categories.filter(Boolean).length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{subject.categories.filter(Boolean).length - 2}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Badge variant="secondary" className="text-xs text-muted-foreground">
                              None
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subject.subCategories.filter(Boolean).length > 0 ? (
                            <>
                              {subject.subCategories.filter(Boolean).slice(0, 2).map((subCat, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  <Network className="h-3 w-3 mr-1" />
                                  {subCat}
                                </Badge>
                              ))}
                              {subject.subCategories.filter(Boolean).length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{subject.subCategories.filter(Boolean).length - 2}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Badge variant="secondary" className="text-xs text-muted-foreground">
                              None
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {subject.updatedAt 
                          ? new Date(subject.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
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
                              onClick={() => window.location.href = `/admin/master/subject-master/edit/${subject._id}`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Subject
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Subject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {!loading && filteredSubjects.length > 0 && (
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
              disabled={subjects.length < 10}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
