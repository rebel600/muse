"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PostEditorHeader from "./post-editor-header";
import { toast } from "sonner";
import PostEditorContent from "./post-editor-content";
import { Quill } from "react-quill-new";

interface InitialDataProps {
  _id?: string;
  title?: string | null;
  content?: string | null;
  category?: string | null;
  tags?: string[];
  featuredImage?: string | null;
  scheduledFor?: string | number | null;
  status?: string | null;
}

interface PostEditorProps {
  initialData?: InitialDataProps | null;
  mode: string;
}

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
  tags: z.array(z.string().max(10, "Maximum 10 tags allowed")),
  featuredImage: z.string().optional(),
  scheduledFor: z.string().optional(),
});

const PostEditor = ({ initialData, mode = "create" }: PostEditorProps) => {
  const router = useRouter();
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [imageModalType, setImageModalType] = useState<string>("featured");
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [quillRef, setQuillRef] = useState<Quill | null>(null);
  const { mutate: createPost, isLoading: isCreateLoading } = useConvexMutation(
    api.posts.create,
  );

  const { mutate: updatePost, isLoading: isUpdating } = useConvexMutation(
    api.posts.update,
  );

  const form = useForm<{
    title: string;
    content: string;
    tags: string[];
    category?: string | undefined;
    featuredImage?: string | undefined;
    scheduledFor?: string | undefined;
  }>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      tags: initialData?.tags || [],
      featuredImage: initialData?.featuredImage || "",
      scheduledFor: initialData?.scheduledFor
        ? new Date().toISOString().slice(0, 16)
        : "",
    },
  });

  const { handleSubmit, watch, setValue } = form;
  const watchedValues = watch();

  // Submit handler
  const onSubmit = async (
    data: any,
    action: string,
    silent: boolean = false,
  ) => {
    try {
      const postData = {
        title: data.title,
        content: data.content,
        category: data.category || undefined,
        tags: data.tags,
        featuredImage: data.featuredImage || undefined,
        status: action === "publish" ? "published" : "draft",
        scheduledFor: data.scheduledFor
          ? new Date(data.scheduledFor).getTime()
          : undefined,
      };

      let resultId;

      if (mode === "edit" && initialData?._id) {
        // Always use update for edit mode
        resultId = await updatePost({
          id: initialData._id,
          ...postData,
        });
      } else if (initialData?._id && action === "draft") {
        // If we have existing draft data, update it
        resultId = await updatePost({
          id: initialData._id,
          ...postData,
        });
      } else {
        // Create new post (will auto-update existing draft if needed)
        resultId = await createPost(postData);
      }

      if (!silent) {
        const message =
          action === "publish" ? "Post published!" : "Draft saved!";
        toast.success(message);
        if (action === "publish") router.push("/dashboard/posts");
      }

      return resultId;
    } catch (error: any) {
      if (!silent) toast.error(error.message || "Failed to save post");
      throw error;
    }
  };

  const handleSave = (silent = false) => {
    handleSubmit((data) => onSubmit(data, "draft", silent))();
  };

  const handlePublish = () => {
    handleSubmit((data) => onSubmit(data, "publish"))();
  };

  const handleSchedule = () => {
    if (!watchedValues.scheduledFor) {
      toast.error("Please select a date and time to schedule");
      return;
    }
    handleSubmit((data) => onSubmit(data, "schedule"))();
  };

  return (
    <div className="min-h-screen bg-slate text-white">
      {/* Header */}
      <PostEditorHeader
        mode={mode}
        initialData={initialData}
        isPublishing={isCreateLoading || isUpdating}
        onSave={handleSave}
        onPublish={handlePublish}
        onSchedule={handleSchedule}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        onBack={() => router.push("/dashboard")}
      />

      {/* Editor */}
      <PostEditorContent
        form={form}
        setQuillRef={setQuillRef}
        onImageUpload={(type) => {
          setImageModalType(type);
          setIsImageModalOpen(true);
        }}
      />

      {/* Settings Dialog */}

      {/* Image Upload Dialog */}
    </div>
  );
};

export default PostEditor;
