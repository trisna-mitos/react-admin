import React from 'react';
import {
  Card,
  CardBody,
  Skeleton,
  Chip
} from '@heroui/react';

import { useRupData } from '../../hooks/useRupData';
import { formatCurrency } from '../../../../utils/formatters';
import type { RupApiParams } from '../../types';

interface RupStatsProps {
  filters: RupApiParams;
}

export const RupStats: React.FC<RupStatsProps> = ({ filters }) => {
  const { data, isLoading } = useRupData(filters);

  const stats = React.useMemo(() => {
    if (!data) return null;

    const totalRecords = data.length;
    const totalPagu = data.reduce((sum, item) => sum + item.pagu, 0);
    const activeRecords = data.filter(item => item.status_rup === 'active').length;
    const avgPagu = totalRecords > 0 ? totalPagu / totalRecords : 0;

    return {
      totalRecords,
      totalPagu,
      activeRecords,
      avgPagu,
      completionRate: totalRecords > 0 ? (activeRecords / totalRecords) * 100 : 0
    };
  }, [data]);

  const statsCards = [
    {
      title: "Total Records",
      value: stats?.totalRecords || 0,
      format: (val: number) => val.toLocaleString(),
      color: "primary" as const,
      icon: "📊"
    },
    {
      title: "Total Pagu",
      value: stats?.totalPagu || 0,
      format: formatCurrency,
      color: "success" as const,
      icon: "💰"
    },
    {
      title: "Active Records",
      value: stats?.activeRecords || 0,
      format: (val: number) => val.toLocaleString(),
      color: "warning" as const,
      icon: "✅"
    },
    {
      title: "Average Pagu",
      value: stats?.avgPagu || 0,
      format: formatCurrency,
      color: "secondary" as const,
      icon: "📈"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((stat, index) => (
        <Card key={index} className="hover:scale-105 transition-transform">
          <CardBody className="flex flex-row items-center justify-between p-4">
            <div className="flex flex-col">
              <p className="text-small text-default-500">{stat.title}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-24 rounded" />
              ) : (
                <p className="text-2xl font-bold">{stat.format(stat.value)}</p>
              )}
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};