export function filterBySearch<T>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return data;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  
  return data.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowercaseSearch);
      }
      if (typeof value === 'number') {
        return value.toString().includes(lowercaseSearch);
      }
      return false;
    })
  );
}

export function filterByCategory<T>(
  data: T[],
  category: string,
  categoryField: keyof T
): T[] {
  if (!category) return data;
  return data.filter(item => item[categoryField] === category);
}

export function filterByRange<T>(
  data: T[],
  field: keyof T,
  min?: number,
  max?: number
): T[] {
  return data.filter(item => {
    const value = item[field] as number;
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    return true;
  });
}

export function filterByMultipleValues<T>(
  data: T[],
  field: keyof T,
  values: any[]
): T[] {
  if (!values.length) return data;
  return data.filter(item => values.includes(item[field]));
}

export function applyFilters<T>(
  data: T[],
  filters: Array<(item: T) => boolean>
): T[] {
  return data.filter(item => filters.every(filter => filter(item)));
}

export function paginateData<T>(
  data: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}