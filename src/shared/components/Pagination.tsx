import { Button } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  showInfo?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  showInfo = true
}: PaginationProps) {
  const goToPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const canGoPrevious = currentPage > 1 && !disabled;
  const canGoNext = currentPage < totalPages && !disabled;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      {showInfo && (
        <span className="text-small text-default-500">
          Page {currentPage} of {totalPages}
        </span>
      )}
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="flat"
          startContent={<ChevronLeft size={16} />}
          onPress={goToPrevious}
          isDisabled={!canGoPrevious}
        >
          Previous
        </Button>
        
        <Button
          size="sm"
          variant="flat"
          endContent={<ChevronRight size={16} />}
          onPress={goToNext}
          isDisabled={!canGoNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}