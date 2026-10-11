import React, { ReactNode } from "react";

export interface ColumnDef<T> {
  key: string;
  header: ReactNode;
  headerClassName?: string;
  className?: string;
  render?: (item: T, index: number) => ReactNode;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  emptyMessage?: string;
  className?: string;
  tableClassName?: string;
  minWidthClass?: string;
  pagination?: ReactNode;
}

export function Table({
  className = "",
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={`w-full text-left text-sm text-foreground ${className}`}
      {...props}
    >
      {children}
    </table>
  );
}

export function TableHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-muted text-muted-foreground ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`border-b border-border hover:bg-muted/50 transition ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  className = "",
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`p-3 sm:p-4 border-b border-border ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className = "",
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`p-3 sm:p-4 ${className}`} {...props}>
      {children}
    </td>
  );
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found.",
  className = "",
  tableClassName = "",
  minWidthClass = "min-w-full",
  pagination,
}: DataTableProps<T>) {
  return (
    <div
      className={`bg-card border border-border rounded overflow-hidden shadow-sm flex flex-col justify-between ${className}`}
    >
      <div className="overflow-x-auto w-full">
        <Table className={`${minWidthClass} ${tableClassName}`}>
          <TableHeader>
            <tr>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.headerClassName}>
                  {col.header}
                </TableHead>
              ))}
            </tr>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <TableRow key={keyExtractor(item, index)}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                        ? col.render(item, index)
                        : (item as Record<string, unknown>)[col.key] != null
                        ? String((item as Record<string, unknown>)[col.key])
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination}
    </div>
  );
}
