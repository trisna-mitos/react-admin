import React from 'react';
import { Button, Chip } from '@heroui/react';
import { Download, RefreshCw } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader/PageHeader';
import { DataTable } from '../../components/shared/DataTable/DataTable';
import { useRupData } from './hooks';
import type { RupItem } from './types';

export default function RupDataPage() {
  const { data, loading, error, refetch } = useRupData();

  // Define table columns
  const columns = [
    { key: 'no', label: 'No' },
    { key: 'nama_satker', label: 'Satker' },
    { key: 'nama_paket', label: 'Nama Paket' },
    { key: 'pagu', label: 'Pagu' },
    { key: 'metode_pengadaan', label: 'Metode' },
    { key: 'jenis_pengadaan', label: 'Jenis' },
  ];

  // Define searchable fields
  const searchFields: (keyof RupItem)[] = ['nama_satker', 'nama_paket', 'metode_pengadaan'];

  // Render cell content
  const renderCell = (item: RupItem, columnKey: string, index: number) => {
    switch (columnKey) {
      case 'no':
        return <span className="text-small font-medium">{index + 1}</span>;
      
      case 'nama_satker':
        return (
          <div className="max-w-xs">
            <p className="text-small font-semibold truncate">{item.nama_satker}</p>
          </div>
        );
      
      case 'nama_paket':
        return (
          <div className="max-w-sm">
            <p className="text-small truncate" title={item.nama_paket}>
              {item.nama_paket}
            </p>
          </div>
        );
      
      case 'pagu':
        return (
          <span className="text-small font-semibold text-success">
            {item.pagu ? `Rp ${item.pagu.toLocaleString('id-ID')}` : '-'}
          </span>
        );
      
      case 'metode_pengadaan':
        return (
          <Chip size="sm" variant="flat" color="primary">
            {item.metode_pengadaan}
          </Chip>
        );
      
      case 'jenis_pengadaan':
        return (
          <Chip size="sm" variant="flat" color="secondary">
            {item.jenis_pengadaan}
          </Chip>
        );
      
      default:
        return null;
    }
  };

  // Page header actions
  const headerActions = (
    <>
      <Button
        startContent={<RefreshCw size={16} />}
        variant="flat"
        onPress={refetch}
        isLoading={loading}
      >
        Refresh
      </Button>
      <Button
        startContent={<Download size={16} />}
        color="primary"
        isDisabled={data.length === 0}
      >
        Export
      </Button>
    </>
  );

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Data RUP 2025"
        subtitle="Daftar Rencana Umum Pengadaan Penyedia Tahun 2025"
        actions={headerActions}
      />

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        searchPlaceholder="Cari satker, paket, atau metode..."
        onRetry={refetch}
        renderCell={renderCell}
        searchFields={searchFields}
        pageSize={20}
      />
    </div>
  );
}