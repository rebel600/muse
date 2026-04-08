"use client";

import { useState } from "react";
import { BarLoader } from "react-spinners";
import { Loader2, User } from "lucide-react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Settings = () => {
  const [username, setUsername] = useState("");
  const { data: currentUser, isLoading } = useConvexQuery(api.users.getMe);
  const {
    mutate: updateUsername,
    isLoading: isUpdating,
    error,
  } = useConvexMutation(api.users.updateUsername);

  if (isLoading) {
    return <BarLoader width={"100%"} color="#DA4453" />;
  }


  const handleUpdateUsername = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if(!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    await updateUsername({ username: username.trim() });
    toast.success("Username updated successfully!");
  };

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div className="">
        <h1 className="text-3xl font-bold gradient-text-primary ">Settings</h1>
        <p className="text-slate-400 mt-2">
          Manage your profile and account preferences
        </p>
      </div>
      <Card className="card-glass max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <User className="h-5 w-5 mr-2" />
            Username Settings
          </CardTitle>
          <CardDescription>
            Set your unique username for your public profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateUsername}>
            <div className="space-y-2">
              <Label className="text-white" htmlFor="username">
                Username
              </Label>
              <Input
                className="text-white bg-slate-800 border-slate-600"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />

              {currentUser?.username && (
                <div className="text-sm text-slate-400">
                  Current username:{" "}
                  <span className="text-white">@{currentUser?.username}</span>
                </div>
              )}

              <div className="text-xs text-slate-600">
                3-20 characters, letters, numbers, underscores, and hyphens
                only.
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                className="w-fit sm:w-auto"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Updating...
                  </>
                ) : (
                  "Update Username"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
