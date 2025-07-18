import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem } from '@heroui/react';
import type { Product, ProductCreateRequest, ProductUpdateRequest, CategoryItem } from '../types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductCreateRequest | ProductUpdateRequest) => void;
  product?: Product | null;
  categories: CategoryItem[];
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  categories,
  loading = false
}) => {
  const [formData, setFormData] = useState<ProductCreateRequest>({
    title: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    brand: '',
    discountPercentage: 0,
    rating: 0,
    sku: '',
    weight: 0,
    dimensions: {
      width: 0,
      height: 0,
      depth: 0
    },
    warrantyInformation: '',
    shippingInformation: '',
    availabilityStatus: 'In Stock',
    returnPolicy: '',
    minimumOrderQuantity: 1,
    images: [],
    thumbnail: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        brand: product.brand,
        discountPercentage: product.discountPercentage,
        rating: product.rating,
        sku: product.sku,
        weight: product.weight,
        dimensions: product.dimensions,
        warrantyInformation: product.warrantyInformation,
        shippingInformation: product.shippingInformation,
        availabilityStatus: product.availabilityStatus,
        returnPolicy: product.returnPolicy,
        minimumOrderQuantity: product.minimumOrderQuantity,
        images: product.images,
        thumbnail: product.thumbnail
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        price: 0,
        stock: 0,
        brand: '',
        discountPercentage: 0,
        rating: 0,
        sku: '',
        weight: 0,
        dimensions: {
          width: 0,
          height: 0,
          depth: 0
        },
        warrantyInformation: '',
        shippingInformation: '',
        availabilityStatus: 'In Stock',
        returnPolicy: '',
        minimumOrderQuantity: 1,
        images: [],
        thumbnail: ''
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (product) {
      onSave({ ...formData, id: product.id });
    } else {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDimensionChange = (dimension: 'width' | 'height' | 'depth', value: number) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        width: prev.dimensions?.width || 0,
        height: prev.dimensions?.height || 0,
        depth: prev.dimensions?.depth || 0,
        [dimension]: value
      }
    }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          {product ? 'Edit Product' : 'Add New Product'}
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              errorMessage={errors.title}
              isInvalid={!!errors.title}
              isRequired
            />
            
            <Input
              label="Brand"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              errorMessage={errors.brand}
              isInvalid={!!errors.brand}
              isRequired
            />
          </div>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            errorMessage={errors.description}
            isInvalid={!!errors.description}
            isRequired
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              placeholder="Select category"
              selectedKeys={formData.category ? [formData.category] : []}
              onSelectionChange={(keys) => {
                const selectedCategory = Array.from(keys)[0] as string;
                handleInputChange('category', selectedCategory || '');
              }}
              errorMessage={errors.category}
              isInvalid={!!errors.category}
              isRequired
            >
              {categories.map((category) => (
                <SelectItem key={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="SKU"
              value={formData.sku || ''}
              onChange={(e) => handleInputChange('sku', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Price"
              type="number"
              value={formData.price.toString()}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              errorMessage={errors.price}
              isInvalid={!!errors.price}
              isRequired
              startContent="$"
            />
            
            <Input
              label="Stock"
              type="number"
              value={formData.stock.toString()}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              errorMessage={errors.stock}
              isInvalid={!!errors.stock}
              isRequired
            />

            <Input
              label="Discount %"
              type="number"
              value={formData.discountPercentage?.toString() || '0'}
              onChange={(e) => handleInputChange('discountPercentage', parseFloat(e.target.value) || 0)}
              endContent="%"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Weight"
              type="number"
              value={formData.weight?.toString() || '0'}
              onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
              endContent="kg"
            />

            <Input
              label="Min Order Quantity"
              type="number"
              value={formData.minimumOrderQuantity?.toString() || '1'}
              onChange={(e) => handleInputChange('minimumOrderQuantity', parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Width"
              type="number"
              value={formData.dimensions?.width?.toString() || '0'}
              onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 0)}
              endContent="cm"
            />
            
            <Input
              label="Height"
              type="number"
              value={formData.dimensions?.height?.toString() || '0'}
              onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value) || 0)}
              endContent="cm"
            />
            
            <Input
              label="Depth"
              type="number"
              value={formData.dimensions?.depth?.toString() || '0'}
              onChange={(e) => handleDimensionChange('depth', parseFloat(e.target.value) || 0)}
              endContent="cm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Thumbnail URL"
              value={formData.thumbnail || ''}
              onChange={(e) => handleInputChange('thumbnail', e.target.value)}
            />

            <Select
              label="Availability Status"
              selectedKeys={formData.availabilityStatus ? [formData.availabilityStatus] : []}
              onSelectionChange={(keys) => {
                const selectedStatus = Array.from(keys)[0] as string;
                handleInputChange('availabilityStatus', selectedStatus || 'In Stock');
              }}
            >
              <SelectItem key="In Stock">In Stock</SelectItem>
              <SelectItem key="Low Stock">Low Stock</SelectItem>
              <SelectItem key="Out of Stock">Out of Stock</SelectItem>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Warranty Information"
              value={formData.warrantyInformation || ''}
              onChange={(e) => handleInputChange('warrantyInformation', e.target.value)}
            />

            <Textarea
              label="Shipping Information"
              value={formData.shippingInformation || ''}
              onChange={(e) => handleInputChange('shippingInformation', e.target.value)}
            />
          </div>

          <Textarea
            label="Return Policy"
            value={formData.returnPolicy || ''}
            onChange={(e) => handleInputChange('returnPolicy', e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="light" 
            onPress={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={loading}
          >
            {product ? 'Update' : 'Create'} Product
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};