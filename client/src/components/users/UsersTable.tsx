import UserTableRow, { IUserItem } from "./UserTableRow";
import UserPagination from "./UserPagination";

interface UsersTableProps {
  users: IUserItem[];
  currentUserId: string;
  page: number;
  totalPages: number;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export default function UsersTable({
  users,
  currentUserId,
  page,
  totalPages,
  buildQuery,
}: UsersTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/60 text-muted-foreground uppercase text-[11px] tracking-wider border-b border-border">
            <tr>
              <th className="py-3.5 px-4 font-semibold">User</th>
              <th className="py-3.5 px-4 font-semibold">Role</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold">Verified</th>
              <th className="py-3.5 px-4 font-semibold">Registered</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No users found matching current filters.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <UserTableRow
                  key={u._id}
                  user={u}
                  currentUserId={currentUserId}
                  buildQuery={buildQuery}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserPagination
        page={page}
        totalPages={totalPages}
        buildQuery={buildQuery}
      />
    </div>
  );
}
