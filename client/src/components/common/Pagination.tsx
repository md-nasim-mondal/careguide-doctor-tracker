import Link from "next/link";
import type { PaginationProps } from "@/types";

export default function Pagination({ currentPage, totalPages, buildPageUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-4 bg-muted border-t border-border text-xs sm:text-sm">
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="px-2.5 py-1 bg-card border border-border rounded-lg hover:bg-card/80 transition font-medium"
        >
          Previous
        </Link>
      ) : (
        <span className="px-2.5 py-1 bg-card border border-border rounded-lg opacity-50 cursor-not-allowed font-medium">
          Previous
        </span>
      )}

      <span className="text-muted-foreground font-medium text-2xs sm:text-xs">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="px-2.5 py-1 bg-card border border-border rounded-lg hover:bg-card/80 transition font-medium"
        >
          Next
        </Link>
      ) : (
        <span className="px-2.5 py-1 bg-card border border-border rounded-lg opacity-50 cursor-not-allowed font-medium">
          Next
        </span>
      )}
    </div>
  );
}

export { Pagination };

