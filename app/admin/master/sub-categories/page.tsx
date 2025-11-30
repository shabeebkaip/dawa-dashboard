"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  Plus, 
  Search, 
  FolderTree,
  ArrowUpDown,
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

interface Category {
  _id: string;
  categoryName: string;
  featured: boolean;
  speachCount: number;
  sortOrder: number;
  updatedAt?: string;
}

interface SubCategory {
  _id: string;
  subCatName: string;
  categoryId: Category | null;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function SubCategoriesPage() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSubCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/sub_category?limit=10&page=${page}`);
      const data = await parseResponse<SubCategory[]>(response);
      setSubCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch sub categories:", error);
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubCategories = subCategories.filter((subCat) =>
    subCat.subCatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (subCat.categoryId?.categoryName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const withCategory = subCategories.filter((sc) => sc.categoryId !== null).length;
  const withoutCategory = subCategories.filter((sc) => sc.categoryId === null).length;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4 ml-12 lg:ml-0">
            <h1 className="text-2xl font-bold text-gray-900">Sub Categories</h1>
            <Badge variant="secondary" className="text-xs">
              {subCategories.length} sub categories
            </Badge>
          </div>
          <Link href="/admin/master/sub-categories/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Sub Category
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
              placeholder="Search sub categories or parent categories..."
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
                  <p className="text-xs font-medium text-muted-foreground">Total Sub Categories</p>
                  <p className="text-xl font-bold text-foreground mt-1">{subCategories.length}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Network className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">With Category</p>
                  <p className="text-xl font-bold text-foreground mt-1">{withCategory}</p>
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
                  <p className="text-xs font-medium text-muted-foreground">Without Category</p>
                  <p className="text-xl font-bold text-foreground mt-1">{withoutCategory}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                  <Network className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Avg Sort Order</p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    {subCategories.length > 0 
                      ? Math.round(subCategories.reduce((sum, sc) => sum + (sc.sortOrder || 0), 0) / subCategories.length)
                      : 0}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                  <ArrowUpDown className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sub Categories Table */}
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
        ) : filteredSubCategories.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No sub categories found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search query" : "Get started by creating your first sub category"}
              </p>
              {!searchQuery && (
                <Link href="/admin/master/sub-categories/add">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Sub Category
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
                    <TableHead>Sub Category Name</TableHead>
                    <TableHead>Parent Category</TableHead>
                    <TableHead className="text-center">Sort Order</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubCategories.map((subCat, index) => (
                    <TableRow key={subCat._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-muted-foreground">
                        {(page - 1) * 10 + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Network className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{subCat.subCatName}</div>
                            <div className="text-xs text-muted-foreground">ID: {subCat._id.slice(-8)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {subCat.categoryId ? (
                          <div className="flex items-center gap-2">
                            <FolderTree className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">{subCat.categoryId.categoryName}</div>
                              {subCat.categoryId.featured && (
                                <Badge variant="outline" className="text-xs mt-1">Featured</Badge>
                              )}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-muted-foreground">
                            No Category
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {subCat.sortOrder || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {subCat.createdAt 
                          ? new Date(subCat.createdAt).toLocaleDateString("en-US", {
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
                              onClick={() => window.location.href = `/admin/master/sub-categories/edit/${subCat._id}`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Sub Category
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Sub Category
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
        {!loading && filteredSubCategories.length > 0 && (
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
              disabled={subCategories.length < 10}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
