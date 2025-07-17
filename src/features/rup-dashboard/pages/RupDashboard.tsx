import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Spacer,
  Breadcrumbs,
  BreadcrumbItem
} from '@heroui/react';

import { RupTable } from '../components/RupTable';
import { RupStats } from '../components/RupStats';
import type { RupApiParams } from '../types';

export const RupDashboard: React.FC = () => {
  const [filters, setFilters] = useState<RupApiParams>({
    tahun: 2025,
    kd_satker: 'D112',
    tipe: '4:12',
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs>
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        <BreadcrumbItem>RUP</BreadcrumbItem>
      </Breadcrumbs>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">RUP Dashboard</h1>
        <p className="text-default-500 mt-2">
          Manage and view Rencana Umum Pengadaan (RUP) data
        </p>
      </div>

      <Spacer y={4} />

      {/* Stats Cards */}
      <RupStats filters={filters} />

      <Spacer y={6} />

      {/* Main Table */}
      <Card>
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-lg font-semibold">RUP Data</p>
            <p className="text-small text-default-500">
              Browse and manage RUP records
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <RupTable 
            filters={filters} 
            onFilterChange={setFilters} 
          />
        </CardBody>
      </Card>
    </div>
  );
};
