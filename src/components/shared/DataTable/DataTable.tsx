import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Card,
  CardBody,
  Spinner,
  Pagination
} from '@heroui/react';
import { Search, RotateCcw } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column[];
  loading?: boolean;
  error?: string;
  searchPlaceholder?: string;
  onRetry?: () => void;
  renderCell: (item: T, columnKey: string, index: number) => React.ReactNode;
  searchFields?: (keyof T)[];
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error,
  searchPlaceholder = "Search...",
  onRetry,
  renderCell,
  searchFields = [],
  pageSize = 10
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!search) return data;
    
    return data.filter(item =>
      searchFields.some(field =>
        String(item[field]).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search, searchFields]);

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Reset page when search changes
  React.useEffect(() => {
    setPage(1);
  }, [search]);

  if (error) {
    return (
      <Card>
        <CardBody className="text-center p-8">
          <p className="text-danger mb-4">{error}</p>
          {onRetry && (
            <Button color="primary" onPress={onRetry} startContent={<RotateCcw size={16} />}>
              Try Again
            </Button>
          )}
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startContent={<Search size={18} />}
          className="max-w-sm"
          variant="bordered"
        />
        <span className="text-small text-default-500">
          {filteredData.length} items found
        </span>
      </div>

      {/* Table */}
      <Table
        bottomContent={
          totalPages > 1 && (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                color="primary"
                page={page}
                total={totalPages}
                onChange={setPage}
              />
            </div>
          )
        }
      >
        <TableHeader>
          {columns.map(column => (
            <TableColumn key={column.key}>
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={<Spinner />}
          emptyContent="No data found"
        >
          {paginatedData.map((item, index) => (
            <TableRow key={index}>
              {columns.map(column => (
                <TableCell key={column.key}>
                  {renderCell(item, column.key, (page - 1) * pageSize + index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
