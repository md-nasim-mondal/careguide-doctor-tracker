import Link from "next/link";

interface UserPaginationProps {
  page: number;
  totalPages: number;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export default function UserPagination({
  page,
  totalPages,
  buildQuery,
}: UserPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card">
      <div className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </div>
      <div className="flex gap-1.5">
        {page > 1 && (
          <Link
            href={`/dashboard/users${buildQuery({ page: page - 1 })}`}
            className="px-3 py-1 text-xs border border-border rounded bg-muted hover:bg-muted/80 text-foreground"
          >
            Previous
          </Link>
        )}
        {page < totalPages && (
          <Link
            href={`/dashboard/users${buildQuery({ page: page + 1 })}`}
            className="px-3 py-1 text-xs border border-border rounded bg-muted hover:bg-muted/80 text-foreground"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
