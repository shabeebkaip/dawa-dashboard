"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Save, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { userFormSchema, type UserFormValues } from "@/lib/validations/user";

interface UserFormProps {
  defaultValues?: UserFormValues;
  onSubmit: (data: UserFormValues) => Promise<void>;
  isEdit?: boolean;
  existingThumbnail?: string;
  isLoading?: boolean;
}

export function UserForm({ 
  defaultValues, 
  onSubmit, 
  isEdit = false,
  existingThumbnail,
  isLoading = false 
}: UserFormProps) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(existingThumbnail || "");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultValues || {
      name: "",
      username: "",
      password: "",
      author: false,
      adminPanelAccess: false,
      featured: false,
      sortOrder: 1,
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(existingThumbnail || "");
  };

  const onFormSubmit = async (data: UserFormValues) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            {isEdit ? "Update the user&apos;s basic details" : "Enter the user&apos;s basic details"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username/Email *</Label>
            <Input
              id="username"
              type="email"
              placeholder="john@example.com"
              {...form.register("username")}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password {isEdit ? "" : "*"}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={isEdit ? "Leave blank to keep current password" : "Enter password"}
                {...form.register("password")}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
            {isEdit && (
              <p className="text-xs text-muted-foreground">
                Only fill this if you want to change the password
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              min="1"
              {...form.register("sortOrder", { valueAsNumber: true })}
            />
            {form.formState.errors.sortOrder && (
              <p className="text-sm text-destructive">{form.formState.errors.sortOrder.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload a profile picture for the user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {thumbnailPreview ? (
              <div className="relative inline-block">
                <Image
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-lg object-cover border border-gray-200"
                  unoptimized={!existingThumbnail || thumbnailFile !== null}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={removeThumbnail}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <Label htmlFor="thumbnail" className="cursor-pointer text-primary hover:text-primary/80">
                    Click to upload
                  </Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>Set user roles and access permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Controller
            name="author"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="author" className="text-base font-medium">
                    Author
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    User can create and manage content
                  </p>
                </div>
                <Switch
                  id="author"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          <Controller
            name="adminPanelAccess"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="adminPanelAccess" className="text-base font-medium">
                    Admin Panel Access
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    User can access admin dashboard
                  </p>
                </div>
                <Switch
                  id="adminPanelAccess"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          <Controller
            name="featured"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="featured" className="text-base font-medium">
                    Featured
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display user in featured section
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4 justify-end">
        <Button type="submit" disabled={isLoading} className="gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update User" : "Create User")}
        </Button>
      </div>
    </form>
  );
}
