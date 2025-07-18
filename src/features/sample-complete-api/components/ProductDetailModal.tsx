import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, Image, Chip } from '@heroui/react';
import type { Product } from '../types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onEdit,
  onDelete
}) => {
  if (!product) return null;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">{product.title}</h2>
          <p className="text-small text-default-500">{product.brand}</p>
        </ModalHeader>
        <ModalBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full max-w-md rounded-lg"
                  fallbackSrc="/api/placeholder/400/300"
                />
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {product.images.slice(0, 3).map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-20 object-cover rounded-md"
                      fallbackSrc="/api/placeholder/100/100"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Chip 
                  color={getAvailabilityColor(product.availabilityStatus)}
                  variant="flat"
                  size="sm"
                >
                  {product.availabilityStatus}
                </Chip>
                <Chip variant="flat" size="sm" color="secondary">
                  {product.category}
                </Chip>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-small text-default-500">Price:</span>
                  <span className="text-lg font-semibold text-primary">
                    {formatPrice(product.price)}
                  </span>
                </div>

                {product.discountPercentage > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-small text-default-500">Discount:</span>
                    <span className="text-small text-success">
                      {product.discountPercentage}% OFF
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-small text-default-500">Stock:</span>
                  <span className="text-small">{product.stock} units</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-small text-default-500">Rating:</span>
                  <span className="text-small">⭐ {product.rating}/5</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-small text-default-500">SKU:</span>
                  <span className="text-small font-mono">{product.sku}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-small text-default-500">Weight:</span>
                  <span className="text-small">{product.weight} kg</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-small text-default-500">Dimensions:</span>
                  <span className="text-small">
                    {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-small text-default-500">Min Order:</span>
                  <span className="text-small">{product.minimumOrderQuantity} units</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardBody>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-small text-default-600">
                  {product.description}
                </p>
              </CardBody>
            </Card>

            {product.warrantyInformation && (
              <Card>
                <CardBody>
                  <h3 className="font-semibold mb-2">Warranty</h3>
                  <p className="text-small text-default-600">
                    {product.warrantyInformation}
                  </p>
                </CardBody>
              </Card>
            )}

            {product.shippingInformation && (
              <Card>
                <CardBody>
                  <h3 className="font-semibold mb-2">Shipping</h3>
                  <p className="text-small text-default-600">
                    {product.shippingInformation}
                  </p>
                </CardBody>
              </Card>
            )}

            {product.returnPolicy && (
              <Card>
                <CardBody>
                  <h3 className="font-semibold mb-2">Return Policy</h3>
                  <p className="text-small text-default-600">
                    {product.returnPolicy}
                  </p>
                </CardBody>
              </Card>
            )}

            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag, index) => (
                    <Chip key={index} size="sm" variant="flat">
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {product.reviews && product.reviews.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Recent Reviews</h3>
                <div className="space-y-2">
                  {product.reviews.slice(0, 2).map((review, index) => (
                    <Card key={index} className="p-2">
                      <CardBody className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-small font-medium">
                            {review.reviewerName}
                          </span>
                          <span className="text-small text-default-500">
                            ⭐ {review.rating}/5
                          </span>
                        </div>
                        <p className="text-small text-default-600">
                          {review.comment}
                        </p>
                        <p className="text-tiny text-default-400 mt-1">
                          {formatDate(review.date)}
                        </p>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="text-tiny text-default-400 space-y-1">
              <p>Created: {formatDate(product.meta.createdAt)}</p>
              <p>Updated: {formatDate(product.meta.updatedAt)}</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button 
              color="primary" 
              onPress={() => onEdit(product)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button 
              color="danger" 
              onPress={() => onDelete(product)}
            >
              Delete
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};