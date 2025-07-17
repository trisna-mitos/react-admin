import React, { useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  User,
  Pagination,
  Spinner,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Spacer
} from '@heroui/react';
import { SearchIcon } from '@heroicons/react/24/outline';

import { useRupData } from '../../hooks/useRupData';
import { formatCurrency } from '../../../../utils/formatters';
import type { RupApiParams, RupApiResponse } from '../../types';

interface RupTableProps {
  filters: RupApiParams;
  onFilterChange: (filters: RupApiParams) => void;
}

export const RupTable: React.FC<RupTableProps> = ({ filters, onFilterChange }) => {
  const { data, isLoading, error, refetch } = useRupData(filters);
  
  const [page, setPage] = React.useState(1);
  const [searchValue, setSearchValue] = React.useState("");
  const rowsPerPage = 10;

  // Filter and paginate data
  const filteredItems = useMemo(() => {
    if (!data) return [];
    
    let filtered = [...data];
    
    if (searchValue) {
      filtered = filtered.filter((item) =>
        item.nama_paket.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.nama_satker.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.kd_rup.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    
    return filtered;
  }, [data, searchValue]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const renderCell = React.useCallback((item: RupApiResponse, columnKey: React.Key) => {
    switch (columnKey) {
      case "kd_rup":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm font-mono">{item.kd_rup}</p>
          </div>
        );
      case "nama_satker":
        return (
          <User
            name={item.nama_satker}
            description={`Kode: ${item.kd_satker}`}
            avatarProps={{
              radius: "lg",
              src: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nama_satker)}&background=random`,
            }}
          />
        );
      case "nama_paket":
        return (
          <div className="flex flex-col max-w-xs">
            <p className="text-bold text-sm truncate" title={item.nama_paket}>
              {item.nama_paket}
            </p>
          </div>
        );
      case "pagu":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm font-mono">{formatCurrency(item.pagu)}</p>
          </div>
        );
      case "metode_pengadaan":
        return (
          <Chip 
            className="capitalize" 
            color="primary" 
            size="sm" 
            variant="flat"
          >
            {item.metode_pengadaan}
          </Chip>
        );
      case "status_rup":
        return (
          <Chip 
            className="capitalize"
            color={item.status_rup === 'active' ? 'success' : 'default'}
            size="sm" 
            variant="flat"
          >
            {item.status_rup}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => {
                // Navigate to detail page
                window.location.href = `/rup/${item.kd_rup}`;
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Button>
          </div>
        );
      default:
        return <span>{String(item[columnKey as keyof RupApiResponse])}</span>;
    }
  }, []);

  const columns = [
    { name: "KODE RUP", uid: "kd_rup" },
    { name: "SATKER", uid: "nama_satker" },
    { name: "NAMA PAKET", uid: "nama_paket" },
    { name: "PAGU", uid: "pagu" },
    { name: "METODE", uid: "metode_pengadaan" },
    { name: "STATUS", uid: "status_rup" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name, satker, or kode RUP..."
            startContent={<SearchIcon className="w-4 h-4" />}
            value={searchValue}
            onClear={() => setSearchValue("")}
            onValueChange={setSearchValue}
          />
          <div className="flex gap-3">
            <Select
              label="Tahun"
              placeholder="Select year"
              className="w-32"
              selectedKeys={[String(filters.tahun || 2025)]}
              onSelectionChange={(keys) => {
                const selectedYear = Array.from(keys)[0] as string;
                onFilterChange({ ...filters, tahun: parseInt(selectedYear) });
              }}
            >
              <SelectItem key="2025" value="2025">2025</SelectItem>
              <SelectItem key="2024" value="2024">2024</SelectItem>
              <SelectItem key="2023" value="2023">2023</SelectItem>
            </Select>
            <Button color="primary" onPress={() => refetch()}>
              Refresh
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} records
          </span>
        </div>
      </div>
    );
  }, [searchValue, filters, filteredItems.length, onFilterChange, refetch]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {`${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, filteredItems.length)} of ${filteredItems.length}`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={() => setPage(1)}>
            First
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={() => setPage(pages)}>
            Last
          </Button>
        </div>
      </div>
    );
  }, [page, pages, filteredItems.length]);

  if (error) {
    return (
      <Card>
        <CardBody className="text-center p-8">
          <div className="text-danger mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
          <p className="text-default-500 mb-4">{(error as any).message}</p>
          <Button color="primary" onPress={() => refetch()}>
            Try Again
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Table
        aria-label="RUP data table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody 
          items={items} 
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent="No data found"
        >
          {(item) => (
            <TableRow key={item.kd_rup}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};