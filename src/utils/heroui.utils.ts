// Custom variant generator for HeroUI components
export const cardVariants = tv({
  base: [
    "bg-background",
    "border",
    "border-divider",
    "rounded-lg",
    "shadow-sm",
    "transition-all",
    "duration-300"
  ],
  variants: {
    hover: {
      true: "hover:shadow-lg hover:scale-[1.02]",
      false: ""
    },
    bordered: {
      true: "border-2",
      false: "border"
    },
    size: {
      sm: "p-3",
      md: "p-4",
      lg: "p-6"
    }
  },
  defaultVariants: {
    hover: false,
    bordered: false,
    size: "md"
  }
});

export type CardVariants = VariantProps<typeof cardVariants>;

// Utility for status color mapping
export const getStatusColor = (status: string): "success" | "warning" | "danger" | "default" => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'success':
      return 'success';
    case 'pending':
    case 'in_progress':
    case 'warning':
      return 'warning';
    case 'failed':
    case 'error':
    case 'cancelled':
      return 'danger';
    default:
      return 'default';
  }
};

// Utility for priority color mapping
export const getPriorityColor = (priority: string): "danger" | "warning" | "success" | "default" => {
  switch (priority.toLowerCase()) {
    case 'high':
    case 'urgent':
      return 'danger';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

// Format file size utility
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
