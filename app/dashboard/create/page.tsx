"use client";
import PostEditor from "@/components/post-editor";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BarLoader } from "react-spinners";

const CreatePost = () => {
  const { data: existingDraft, isLoading: isDraftLoading } = useConvexQuery(
    api.posts.getUserDraft,
  );
  const { data: currentUser, isLoading: isUserLoading } = useConvexQuery(
    api.users.getMe,
  );

  if (isDraftLoading || isUserLoading) {
    return <BarLoader width={"100%"} color="#DA4453" />;
  }

  if (!currentUser?.username) {
    return (
      <div className="h-80 flex bg-slate-900 items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h1 className="text-3xl text-bold text-white">Username Required!</h1>
          <p className="text-slate-400 text-lg">
            Set up a username to create or share your posts
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard/settings">
              <Button variant="primary">
                Set Up Username
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <PostEditor initialData={existingDraft} mode="create" />;
};

export default CreatePost;
