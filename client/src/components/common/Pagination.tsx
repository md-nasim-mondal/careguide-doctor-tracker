import Link from "next/link";
import type { PaginationProps } from "@/types";

export default function Pagination({ currentPage, totalPages, buildPageUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-muted border-t border-border">
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="px-3 py-1 bg-card border border-border rounded text-sm hover:bg-card/80 transition"
        >
          Previous
        </Link>
      ) : (
        <span className="px-3 py-1 bg-card border border-border rounded text-sm opacity-50 cursor-not-allowed">
          Previous
        </span>
      )}

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="px-3 py-1 bg-card border border-border rounded text-sm hover:bg-card/80 transition"
        >
          Next
        </Link>
      ) : (
        <span className="px-3 py-1 bg-card border border-border rounded text-sm opacity-50 cursor-not-allowed">
          Next
        </span>
      )}
    </div>
  );
}

export { Pagination };

