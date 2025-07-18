# API Agent Development Guidelines - Core Principles

> **This document establishes MANDATORY architectural principles and dependencies for all React feature development. Deviation from these guidelines requires explicit approval.**

---

## 🎯 **Core Philosophy**

### **1. Research-First Approach**
- **ALWAYS** analyze existing codebase patterns before writing ANY code
- **FOLLOW** established architectural patterns exactly (use rup-data as template)
- **UNDERSTAND** shared components and their usage patterns
- **STUDY** the existing API integration patterns

### **2. Consistency Over Innovation**
- **MAINTAIN** architectural consistency across all features
- **REUSE** existing patterns and components
- **AVOID** creating new approaches when existing ones work
- **FOLLOW** the established folder structure and naming conventions

---

## 🔒 **MANDATORY Dependencies & Patterns**

### **1. UI Framework (NON-NEGOTIABLE)**
```json
{
  "@heroui/react": "^2.7.11",
  "tailwindcss": "latest",
  "lucide-react": "^0.525.0",
  "framer-motion": "^12.19.2"
}
```

**Rules:**
- **HeroUI v2.7.11**: The ONLY UI library allowed
- **Components**: Button, Input, Modal, Table, Card, Chip, Select, etc.
- **Tailwind CSS**: For ALL styling and responsive design
- **Lucide React**: For ALL icons (no other icon libraries)
- **Framer Motion**: For animations (already integrated with HeroUI)

**Example Usage:**
```tsx
import { Button, Input, Modal, ModalContent } from '@heroui/react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
```

### **2. Routing & Navigation (MANDATORY)**
```json
{
  "react-router-dom": "^6.30.1"
}
```

**Rules:**
- **React Router DOM v6**: The only routing solution
- **Pattern**: Feature-based routing with nested layouts
- **Structure**: All routes MUST go through AppLayout wrapper

**Example Structure:**
```tsx
// App.tsx
<Route path="/" element={<AppLayout />}>
  <Route path="feature-name" element={<FeaturePage />} />
</Route>

// AppLayout.tsx navigation
<Link to="/feature-name" className="block p-2 rounded hover:bg-gray-700">
  Feature Name
</Link>
```

### **3. HTTP Client & API Integration (STRICT)**
```json
{
  "axios": "^1.10.0"
}
```

**Rules:**
- **Axios**: Direct axios calls (NO shared API client)
- **Pattern**: Follow exact rup-data API structure
- **Error Handling**: Comprehensive logging and user-friendly messages
- **Timeout**: 30-second standard for all requests

**Example Pattern:**
```tsx
// api.ts
import axios from 'axios';

const buildApiUrl = (endpoint: string) => {
  return `${BASE_URL}${endpoint}`;
};

export async function fetchData(): Promise<DataType[]> {
  try {
    const url = buildApiUrl('/endpoint');
    console.log('🚀 Fetching data from:', url);
    
    const response = await axios.get<DataType[]>(url, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    console.log('✅ Response received:', {
      status: response.status,
      dataLength: response.data.length
    });
    
    return response.data;
  } catch (error: any) {
    console.error('❌ API Error details:', {
      message: error.message,
      status: error.response?.status,
      responseData: error.response?.data
    });
    
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
}
```

### **4. State Management (REQUIRED)**
**Rules:**
- **React Hooks**: Custom hooks for each feature
- **Pattern**: `useFeatureName()` hook structure
- **NO**: Redux, Zustand, or global state libraries without approval
- **Local State**: useState for component-level state

**Example Pattern:**
```tsx
// hooks.ts
export function useFeatureData(params: SearchParams = {}) {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await fetchData(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params]);

  return { data, loading, error, refetch: loadData };
}
```

### **5. TypeScript Standards (ENFORCED)**
**Rules:**
- **Full Type Safety**: All interfaces must be defined
- **Import Types**: Use `import type` for type-only imports
- **Generic Components**: Type-safe generic components where needed
- **Strict Mode**: Follow existing tsconfig.json settings

**Example Pattern:**
```tsx
// types.ts
export interface DataItem {
  id: number;
  name: string;
  description: string;
  // ... other properties
}

export interface ApiResponse {
  data: DataItem[];
  total: number;
  page: number;
}

// Component with proper typing
import type { DataItem } from './types';

interface ComponentProps {
  items: DataItem[];
  onSelect: (item: DataItem) => void;
  loading?: boolean;
}
```

---

## 🏗️ **Component Architecture (MANDATORY)**

### **1. Folder Structure**
```
src/
├── features/
│   └── [feature-name]/
│       ├── README.md
│       ├── types.ts
│       ├── api.ts
│       ├── hooks.ts
│       ├── FeaturePage.tsx
│       └── components/
│           ├── FeatureForm.tsx
│           └── FeatureModal.tsx
├── components/
│   └── shared/
│       ├── DataTable/
│       ├── PageHeader/
│       ├── ConfirmationDialog/
│       └── Toast/
└── app/
    └── layout/
        └── AppLayout.tsx
```

### **2. Component Naming & Structure**
**Rules:**
- **PascalCase**: For all component files
- **camelCase**: For utility functions and variables
- **Descriptive Names**: Clear, self-documenting names
- **Single Responsibility**: One component per file

**Example:**
```tsx
// FeaturePage.tsx
export const FeaturePage: React.FC = () => {
  // Component logic
};

// components/FeatureForm.tsx
interface FeatureFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
}

export const FeatureForm: React.FC<FeatureFormProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  // Form logic
};
```

### **3. Shared Components Usage**
**MUST USE existing shared components:**
```tsx
// Required imports for common patterns
import { PageHeader } from '../../components/shared/PageHeader/PageHeader';
import { DataTable } from '../../components/shared/DataTable/DataTable';
import { ConfirmationDialog } from '../../components/shared/ConfirmationDialog';
import { useToast } from '../../components/shared/Toast';
```

---

## 📋 **Form Handling (STANDARD)**

### **Rules:**
- **HeroUI Components**: Input, Textarea, Select, etc.
- **Validation**: Manual validation (no form libraries without approval)
- **Error Display**: Inline error messages with isInvalid prop
- **Loading States**: isLoading prop for submit buttons

### **Example Pattern:**
```tsx
const [formData, setFormData] = useState<FormData>({
  name: '',
  description: ''
});
const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = () => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (!validateForm()) return;
  onSave(formData);
};

// In JSX
<Input
  label="Name"
  value={formData.name}
  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
  errorMessage={errors.name}
  isInvalid={!!errors.name}
  isRequired
/>
```

---

## 📊 **Data Display (REQUIRED)**

### **Rules:**
- **DataTable**: Use existing shared DataTable component
- **Pagination**: External pagination with HeroUI Pagination
- **Loading States**: Spinner components for all async operations
- **Error Handling**: Retry mechanisms and user feedback

### **Example Pattern:**
```tsx
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'actions', label: 'Actions', sortable: false }
];

const renderCell = (item: DataItem, columnKey: string) => {
  switch (columnKey) {
    case 'name':
      return <span className="font-medium">{item.name}</span>;
    case 'actions':
      return (
        <div className="flex gap-2">
          <Button size="sm" onPress={() => handleEdit(item)}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      );
    default:
      return <span>{String(item[columnKey as keyof DataItem])}</span>;
  }
};

<DataTable
  data={data}
  columns={columns}
  loading={loading}
  error={error}
  onRetry={refetch}
  renderCell={renderCell}
/>
```

---

## 🔔 **User Feedback (MANDATORY)**

### **Rules:**
- **Toast System**: Use shared Toast component for notifications
- **Confirmation Dialogs**: Use shared ConfirmationDialog
- **Loading States**: isLoading prop for buttons and forms
- **Error Messages**: User-friendly error messages

### **Example Pattern:**
```tsx
// Toast notifications
const { success, error: showError, ToastContainer } = useToast();

const handleAction = async () => {
  try {
    await performAction();
    success('Action completed successfully');
  } catch (err) {
    showError('Failed to complete action');
  }
};

// In JSX
<ToastContainer />

// Confirmation dialog
<ConfirmationDialog
  isOpen={isDeleteOpen}
  onClose={onDeleteClose}
  onConfirm={handleConfirmDelete}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  confirmText="Delete"
  isLoading={loading}
/>
```

---

## 🚫 **STRICT "NO" LIST**

### **❌ Forbidden Dependencies:**
- **UI Libraries**: Material-UI, Ant Design, Chakra UI, etc.
- **HTTP Clients**: fetch API, different axios patterns
- **State Management**: Redux, Zustand, Context API for global state
- **Routing**: Reach Router, Next.js Router, etc.
- **Icons**: react-icons, heroicons, font-awesome, etc.
- **Forms**: Formik, React Hook Form, etc.
- **Styling**: styled-components, emotion, etc.
- **Testing**: Jest, React Testing Library (without approval)

### **❌ Forbidden Patterns:**
- Creating new API client wrappers
- Custom HTTP interceptors
- Global state management without approval
- Custom UI component libraries
- Alternative folder structures
- Different naming conventions

---

## 🔐 **APPROVAL REQUIRED FOR:**

### **Requires Explicit Approval:**
- 🔐 New dependencies outside the core stack
- 🔐 Alternative state management solutions
- 🔐 Additional form/validation libraries
- 🔐 New HTTP client patterns
- 🔐 Alternative styling approaches
- 🔐 Testing frameworks and libraries
- 🔐 Build tools and bundlers
- 🔐 Alternative TypeScript configurations

### **Approval Process:**
1. **Research**: Document why existing solution doesn't work
2. **Proposal**: Present alternative with clear benefits
3. **Impact Assessment**: Analyze effect on existing codebase
4. **Implementation Plan**: Detailed migration strategy
5. **Testing Strategy**: How to ensure no regressions

---

## 📋 **Development Process (ENFORCED)**

### **1. Task Management**
```tsx
// MUST use TodoWrite tool for ALL tasks
const todos = [
  { id: "1", content: "Research existing patterns", status: "pending", priority: "high" },
  { id: "2", content: "Implement feature structure", status: "pending", priority: "medium" }
];
```

### **2. Development Workflow**
1. **📋 Create Todo List**: Use TodoWrite tool
2. **🔍 Research Phase**: Analyze existing patterns
3. **🏗️ Structure Setup**: Create folder structure
4. **💻 Implementation**: Follow established patterns
5. **🧪 Testing**: npm run dev and npm run build
6. **📝 Documentation**: README.md for feature

### **3. Quality Assurance**
```bash
# MUST run these commands during development
npm run dev    # Test in development
npm run build  # Check TypeScript compilation
```

### **4. Code Review Checklist**
- ✅ Follows existing architectural patterns
- ✅ Uses approved dependencies only
- ✅ Proper TypeScript typing
- ✅ Error handling implemented
- ✅ Loading states for all async operations
- ✅ Responsive design with Tailwind
- ✅ Proper component structure
- ✅ Documentation updated

---

## 🎯 **Success Criteria**

### **A feature is considered complete when:**
1. **✅ Functional**: All requirements implemented
2. **✅ Consistent**: Follows established patterns
3. **✅ Tested**: Development server runs without errors
4. **✅ Compiled**: TypeScript build succeeds
5. **✅ Documented**: README.md created
6. **✅ Accessible**: Proper ARIA labels and keyboard navigation
7. **✅ Responsive**: Works on mobile and desktop
8. **✅ Error Handling**: Comprehensive error management

---

## 📚 **Reference Implementation**

### **Template Feature: sample-complete-api**
Use `src/features/sample-complete-api/` as the **gold standard** reference for:
- ✅ Folder structure
- ✅ API integration patterns
- ✅ Component architecture
- ✅ TypeScript usage
- ✅ Error handling
- ✅ User feedback
- ✅ Documentation

### **Template Files:**
```
src/features/sample-complete-api/
├── README.md              # Feature documentation
├── types.ts               # TypeScript interfaces
├── api.ts                 # API integration
├── hooks.ts               # Custom hooks
├── SampleCompletePage.tsx # Main component
└── components/
    ├── ProductForm.tsx    # Form modal
    └── ProductDetailModal.tsx # Detail modal
```

---

## 🚨 **Emergency Protocols**

### **When Guidelines Are Violated:**
1. **🛑 STOP**: Immediately halt development
2. **📋 Document**: Record what was violated and why
3. **🔍 Assess**: Evaluate impact on existing codebase
4. **📝 Propose**: Submit formal proposal for approval
5. **⏳ Wait**: Do not proceed until approval received

### **Common Violations:**
- Adding new dependencies without approval
- Creating custom API clients
- Using different UI patterns
- Ignoring TypeScript errors
- Skipping error handling
- Not following folder structure

---

## 🏆 **Best Practices**

### **1. Performance**
- ✅ Use pagination for large datasets
- ✅ Implement proper loading states
- ✅ Optimize images with fallbacks
- ✅ Use React.memo for expensive components

### **2. Security**
- ✅ Validate all user inputs
- ✅ Sanitize API responses
- ✅ Handle authentication properly
- ✅ Use proper CORS settings

### **3. Maintainability**
- ✅ Write self-documenting code
- ✅ Use meaningful variable names
- ✅ Keep components small and focused
- ✅ Follow single responsibility principle

### **4. User Experience**
- ✅ Provide immediate feedback
- ✅ Show loading states
- ✅ Handle errors gracefully
- ✅ Maintain responsive design

---

## 📄 **Documentation Standards**

### **Required Documentation:**
1. **README.md**: For each feature
2. **TypeScript Interfaces**: For all data structures
3. **Component Props**: For all components
4. **API Documentation**: For all endpoints
5. **Error Handling**: For all error cases

### **Documentation Template:**
```markdown
# Feature Name

## Features
- List all implemented features

## API Endpoints
- Document all API calls

## Components
- List all components and their purpose

## Usage
- Provide usage examples

## Configuration
- List any configuration options

## Troubleshooting
- Common issues and solutions
```

---

**📜 This document serves as the definitive guide for all React feature development. Adherence to these guidelines ensures code quality, maintainability, and architectural consistency.**

---

*Last Updated: [Current Date]*
*Version: 1.0.0*
*Status: Active*