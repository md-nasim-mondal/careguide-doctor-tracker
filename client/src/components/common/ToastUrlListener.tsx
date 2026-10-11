"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "./Toast";

/**
 * Global component that inspects query parameters (?error=... or ?success=...)
 * across SSR navigations/Server Actions and triggers rich toasts automatically.
 * It gently removes the query param from URL without a full page reload.
 */
export default function ToastUrlListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const lastParamRef = useRef<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const successParam = searchParams.get("success");

    const currentKey = `${errorParam || ""}-${successParam || ""}`;
    if (!errorParam && !successParam) {
      lastParamRef.current = null;
      return;
    }

    if (lastParamRef.current === currentKey) {
      return;
    }
    lastParamRef.current = currentKey;

    if (errorParam) {
      toast.error(decodeURIComponent(errorParam), "Error");
    } else if (successParam) {
      toast.success(decodeURIComponent(successParam), "Success");
    }

    // Clean error / success params from URL smoothly
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("error");
    newParams.delete("success");
    const newQuery = newParams.toString();
    const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  return null;
}
