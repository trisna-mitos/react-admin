import { useState, useMemo } from 'react';
import { Card, CardBody, CardHeader, Divider, Select, SelectItem, Chip } from '@heroui/react';
import { Package } from 'lucide-react';

// Shared components
import DataTable, { type Column } from '../../../shared/components/DataTable';
import SearchInput from '../../../shared/components/SearchInput';
import Pagination from '../../../shared/components/Pagination';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import ErrorMessage from '../../../shared/components/ErrorMessage';

// Feature-specific
import { useProductsData } from '../hooks/useProductsData';
import type { Product, ProductFilters, ProductSortConfig } from '../types';
import { 
  filterProducts, 
  sortProducts, 
  formatProductPrice, 
  formatProductRating,
  getProductRatingColor,
  formatCategoryName,
  getProductStats 
} from '../utils/productUtils';
import { paginateData, getTotalPages } from '../../../shared/utils/filterUtils';
import { toggleSortDirection } from '../../../shared/utils/sortUtils';

const PAGE_SIZE = 10;

export default function ProductsPage() {
  // Data fetching (like GetdataPage pattern)
  const { products: allProducts, categories, loading, error, refetch } = useProductsData();
  
  // Local state for UI (like GetdataPage pattern)
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    priceRange: null
  });
  const [sortConfig, setSortConfig] = useState<ProductSortConfig>({
    field: 'title',
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Client-side processing (like GetdataPage pattern)
  const filteredProducts = useMemo(() => {
    return filterProducts(allProducts, filters);
  }, [allProducts, filters]);

  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortConfig);
  }, [filteredProducts, sortConfig]);

  const totalPages = getTotalPages(sortedProducts.length, PAGE_SIZE);
  
  const paginatedProducts = useMemo(() => {
    return paginateData(sortedProducts, currentPage, PAGE_SIZE);
  }, [sortedProducts, currentPage]);

  const stats = useMemo(() => {
    return getProductStats(filteredProducts);
  }, [filteredProducts]);

  // Event handlers
  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (keys: any) => {
    const category = Array.from(keys)[0] as string;
    setFilters(prev => ({ ...prev, category: category === 'all' ? '' : category }));
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field: field as ProductSortConfig['field'],
      direction: prev.field === field ? toggleSortDirection(prev.direction) : 'asc'
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      priceRange: null
    });
    setCurrentPage(1);
  };

  // Table columns configuration
  const columns: Column<Product>[] = [
    {
      key: 'image',
      label: 'Image',
      sortable: false,
      render: (product) => (
        <div className="flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-12 h-12 object-cover rounded-md"
            loading="lazy"
          />
        </div>
      )
    },
    {
      key: 'title',
      label: 'Product Name',
      sortable: true,
      render: (product) => (
        <div className="flex flex-col">
          <p className="text-bold text-small">{product.title}</p>
          <p className="text-tiny text-default-400 truncate max-w-[200px]">
            {product.description}
          </p>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (product) => (
        <span className="text-small capitalize">{formatCategoryName(product.category)}</span>
      )
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (product) => (
        <span className="text-small font-semibold">{formatProductPrice(product.price)}</span>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (product) => (
        <div className="flex items-center gap-2">
          <span className="text-small">{formatProductRating(product.rating)}</span>
          <Chip
            size="sm"
            variant="flat"
            color={getProductRatingColor(product.rating.rate)}
          >
            ⭐ {product.rating.rate}
          </Chip>
        </div>
      )
    }
  ];

  // Loading and error states (like GetdataPage pattern)
  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/20">
          <Package className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-default-500">
            Browse products with search, filtering, and sorting
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20">
              <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-default-500">Total Products</p>
              <p className="text-xl font-semibold">{stats.totalProducts}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/20">
              <Package className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <p className="text-sm text-default-500">High Rated</p>
              <p className="text-xl font-semibold">{stats.highRatedCount}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/20">
              <Package className="w-5 h-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <p className="text-sm text-default-500">Avg Rating</p>
              <p className="text-xl font-semibold">{stats.averageRating}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900/20">
              <Package className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-sm text-default-500">Avg Price</p>
              <p className="text-xl font-semibold">{formatProductPrice(stats.averagePrice)}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-grow">
              <SearchInput
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search by title, description, or category..."
              />
            </div>
            
            <Select
              placeholder="All Categories"
              size="sm"
              className="min-w-[140px]"
              selectedKeys={filters.category ? [filters.category] : ['all']}
              onSelectionChange={handleCategoryChange}
              items={[{ value: 'all', label: 'All Categories' }, ...categories.map(cat => ({ value: cat, label: formatCategoryName(cat) }))]}
            >
              {(item) => (
                <SelectItem key={item.value}>
                  {item.label}
                </SelectItem>
              )}
            </Select>
          </div>

          <Divider />

          {/* Active Filters */}
          {(filters.search || filters.category) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-small text-default-600">Active filters:</span>
              {filters.search && (
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  onClose={() => handleSearchChange('')}
                >
                  Search: {filters.search}
                </Chip>
              )}
              {filters.category && (
                <Chip
                  size="sm"
                  variant="flat"
                  color="secondary"
                  onClose={() => setFilters(prev => ({ ...prev, category: '' }))}
                >
                  Category: {formatCategoryName(filters.category)}
                </Chip>
              )}
              <Chip
                size="sm"
                variant="flat"
                color="default"
                onClose={clearFilters}
              >
                Clear All
              </Chip>
            </div>
          )}
        </CardHeader>

        <CardBody className="p-0">
          <DataTable
            data={paginatedProducts}
            columns={columns}
            sortConfig={sortConfig}
            onSort={handleSort}
            emptyMessage="No products found"
          />
          
          <div className="p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showInfo={true}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}