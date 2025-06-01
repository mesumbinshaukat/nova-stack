import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';

interface User {
  id: number;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  onRowClick?: (user: User) => void;
}

export function UserTable({ users, onRowClick }: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: (info: any) => <span className="font-mono">{info.getValue()}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info: any) => <span className="text-primary">{info.getValue()}</span>,
    },
    {
      accessorKey: 'isAdmin',
      header: 'Admin',
      cell: (info: any) => (
        <span className={`px-2 py-1 rounded-full text-xs ${info.getValue() ? 'bg-success/20 text-success' : 'bg-neutral/20 text-neutral'}`}>
          {info.getValue() ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-neutral/20">
        <table className="table w-full">
          <thead className="bg-neutral/5">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300 cursor-pointer hover:bg-neutral/10"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: '↑',
                        desc: '↓',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <motion.tr
                key={row.id}
                className="hover:bg-neutral/10 cursor-pointer transition-colors"
                onClick={() => onRowClick?.(row.original)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
        </div>
        <span className="text-sm text-neutral-600 dark:text-neutral-300">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
} 