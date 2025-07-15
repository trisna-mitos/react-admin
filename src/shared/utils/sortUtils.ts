export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export function sortArray<T>(
  array: T[], 
  field: keyof T, 
  direction: SortDirection = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    let comparison = 0;
    
    if (aValue < bValue) {
      comparison = -1;
    } else if (aValue > bValue) {
      comparison = 1;
    }
    
    return direction === 'desc' ? -comparison : comparison;
  });
}

export function sortByMultipleFields<T>(
  array: T[],
  sortConfigs: Array<{ field: keyof T; direction: SortDirection }>
): T[] {
  return [...array].sort((a, b) => {
    for (const config of sortConfigs) {
      const aValue = a[config.field];
      const bValue = b[config.field];
      
      let comparison = 0;
      
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }
      
      if (comparison !== 0) {
        return config.direction === 'desc' ? -comparison : comparison;
      }
    }
    return 0;
  });
}

export function toggleSortDirection(currentDirection: SortDirection): SortDirection {
  return currentDirection === 'asc' ? 'desc' : 'asc';
}

export function getSortedData<T>(
  data: T[],
  sortConfig: SortConfig | null
): T[] {
  if (!sortConfig) return data;
  return sortArray(data, sortConfig.field as keyof T, sortConfig.direction);
}