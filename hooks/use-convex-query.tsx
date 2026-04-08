import { mutation } from "@/convex/_generated/server";
import { useMutation, useQuery } from "convex/react";
import { FunctionReference } from "convex/server";
import Error from "next/error";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export const useConvexQuery = (
  query: FunctionReference<"query">,
  ...args: any
) => {
  const result = useQuery(query, ...args);

  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (result === undefined) {
      setIsLoading(true);
    } else {
      try {
        setData(result);
        setError(null);
      } catch (err: Error | any) {
        setError(err);
        toast.error(err.message || "An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [result]);

  return { data, isLoading, error };
};

export const useConvexMutation = (mutation: FunctionReference<"mutation">) => {
  const mutationFn = useMutation(mutation);

  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const mutate = async (...args: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mutationFn(...args);
      setData(response);
      return response;
    } catch (err: Error | any) {
      setError(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, error };
};


