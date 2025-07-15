import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Card,
  CardBody
} from '@heroui/react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  sortConfig?: SortConfig;
  onSort?: (field: string) => void;
  emptyMessage?: string;
  className?: string;
}

function LoadingSkeleton<T>({ columns }: { columns: Column<T>[] }) {
  return (
    <Card className="w-full">
      <CardBody className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              {columns.map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  className="h-4 rounded"
                  style={{ width: `${100 / columns.length}%` }}
                />
              ))}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  sortConfig,
  onSort,
  emptyMessage = "No data available",
  className = ""
}: DataTableProps<T>) {
  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable || !onSort) return;
    onSort(columnKey);
  };

  const renderSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.field !== columnKey) return null;
    
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={14} className="ml-1" />
    ) : (
      <ChevronDown size={14} className="ml-1" />
    );
  };

  const getCellValue = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }
    return item[column.key];
  };

  if (loading) {
    return <LoadingSkeleton columns={columns} />;
  }

  return (
    <Table
      aria-label="Data table"
      className={className}
      classNames={{
        wrapper: "shadow-none border border-divider rounded-medium",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            className={`${column.sortable ? "cursor-pointer select-none" : ""} ${column.className || ""}`}
            onClick={() => handleSort(column.key)}
          >
            <div className="flex items-center">
              {column.label}
              {renderSortIcon(column.key)}
            </div>
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data}
        emptyContent={
          <div className="text-center py-8">
            <p className="text-default-500">{emptyMessage}</p>
          </div>
        }
      >
        {(item) => (
          <TableRow key={item.id || Math.random()}>
            {columns.map((column) => (
              <TableCell key={column.key} className={column.className}>
                {getCellValue(item, column)}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}