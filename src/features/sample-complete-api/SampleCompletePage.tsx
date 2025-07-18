import React, { useState } from 'react';
import { Button, Input, Select, SelectItem, useDisclosure, Image, Chip, Pagination } from '@heroui/react';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader/PageHeader';
import { DataTable } from '../../components/shared/DataTable/DataTable';
import { ConfirmationDialog } from '../../components/shared/ConfirmationDialog';
import { useToast } from '../../components/shared/Toast';
import { ProductForm } from './components/ProductForm';
import { ProductDetailModal } from './components/ProductDetailModal';
import { useProducts, useCategories, useProductActions } from './hooks';
import type { Product, ProductSearchParams } from './types';

export const SampleCompletePage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<ProductSearchParams>({
    limit: 10,
    skip: 0,
    q: '',
    category: '',
    sortBy: undefined,
    order: 'asc'
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { data: productsData, loading, error, refetch } = useProducts(searchParams);
  const { data: categories } = useCategories();
  const { loading: actionLoading, create, update, remove } = useProductActions();
  const { success, error: showError, ToastContainer } = useToast();
  
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const handleSearch = (searchTerm: string) => {
    setSearchParams(prev => ({
      ...prev,
      q: searchTerm,
      skip: 0
    }));
  };

  const handleCategoryFilter = (category: string) => {
    setSearchParams(prev => ({
      ...prev,
      category: category === 'all' ? '' : category,
      skip: 0
    }));
  };

  const handleSort = (sortBy: string) => {
    setSearchParams(prev => ({
      ...prev,
      sortBy: sortBy as 'price' | 'rating' | 'stock',
      order: prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({
      ...prev,
      skip: (page - 1) * (prev.limit || 10)
    }));
  };


  const handleAddProduct = () => {
    setSelectedProduct(null);
    onFormOpen();
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    onFormOpen();
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    onDetailOpen();
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    onDeleteOpen();
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (selectedProduct) {
        const result = await update(selectedProduct.id, productData);
        if (result) {
          success('Product updated successfully');
          onFormClose();
          refetch();
        }
      } else {
        const result = await create(productData);
        if (result) {
          success('Product created successfully');
          onFormClose();
          refetch();
        }
      }
    } catch (err) {
      showError('Failed to save product');
    }
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      const result = await remove(productToDelete.id);
      if (result) {
        success('Product deleted successfully');
        onDeleteClose();
        refetch();
      } else {
        showError('Failed to delete product');
      }
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'danger';
      default:
        return 'default';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const columns = [
    { key: 'thumbnail', label: 'Image', sortable: false },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'brand', label: 'Brand', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'availabilityStatus', label: 'Status', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  const renderCell = (item: Product, columnKey: string) => {
    switch (columnKey) {
      case 'thumbnail':
        return (
          <Image
            src={item.thumbnail}
            alt={item.title}
            className="w-12 h-12 object-cover rounded-md"
            fallbackSrc="/api/placeholder/48/48"
          />
        );
      case 'title':
        return (
          <div className="flex flex-col">
            <p className="font-medium text-small">{item.title}</p>
            <p className="text-tiny text-default-400">{item.sku}</p>
          </div>
        );
      case 'price':
        return (
          <div className="flex flex-col">
            <p className="font-medium text-small">{formatPrice(item.price)}</p>
            {item.discountPercentage > 0 && (
              <p className="text-tiny text-success">
                {item.discountPercentage}% OFF
              </p>
            )}
          </div>
        );
      case 'stock':
        return (
          <span className={`text-small ${item.stock < 10 ? 'text-warning' : 'text-default-600'}`}>
            {item.stock} units
          </span>
        );
      case 'rating':
        return (
          <span className="text-small">⭐ {item.rating}/5</span>
        );
      case 'availabilityStatus':
        return (
          <Chip 
            color={getAvailabilityColor(item.availabilityStatus)}
            variant="flat"
            size="sm"
          >
            {item.availabilityStatus}
          </Chip>
        );
      case 'actions':
        return (
          <div className="flex gap-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => handleViewProduct(item)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => handleEditProduct(item)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              color="danger"
              onPress={() => handleDeleteProduct(item)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      default:
        return <span className="text-small">{String(item[columnKey as keyof Product])}</span>;
    }
  };

  const currentPage = Math.floor((searchParams.skip || 0) / (searchParams.limit || 10)) + 1;
  const totalPages = Math.ceil(productsData.total / (searchParams.limit || 10));

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Products"
        subtitle={`Manage your product catalog (${productsData.total} total products)`}
        actions={
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onPress={handleAddProduct}
          >
            Add Product
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={searchParams.q || ''}
            onChange={(e) => handleSearch(e.target.value)}
            startContent={<Search className="w-4 h-4" />}
            className="max-w-md"
          />
        </div>

        <Select
          label="Category"
          placeholder="All Categories"
          className="max-w-xs"
          selectedKeys={searchParams.category ? [searchParams.category] : ['all']}
          onSelectionChange={(keys) => {
            const selectedCategory = Array.from(keys)[0] as string;
            handleCategoryFilter(selectedCategory);
          }}
        >
          <SelectItem key="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Sort by"
          placeholder="Sort by"
          className="max-w-xs"
          selectedKeys={searchParams.sortBy ? [searchParams.sortBy] : []}
          onSelectionChange={(keys) => {
            const selectedSort = Array.from(keys)[0] as string;
            handleSort(selectedSort);
          }}
        >
          <SelectItem key="price">Price</SelectItem>
          <SelectItem key="rating">Rating</SelectItem>
          <SelectItem key="stock">Stock</SelectItem>
        </Select>
      </div>

      <DataTable
        data={productsData.products}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refetch}
        renderCell={renderCell}
        pageSize={searchParams.limit || 10}
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            page={currentPage}
            total={totalPages}
            onChange={handlePageChange}
            showShadow
            showControls
          />
        </div>
      )}

      <ProductForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        onSave={handleSaveProduct}
        product={selectedProduct}
        categories={categories}
        loading={actionLoading}
      />

      <ProductDetailModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        product={selectedProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
      />

      <ToastContainer />
    </div>
  );
};