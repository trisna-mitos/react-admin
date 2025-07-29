# API Integration Guide & Development Standards

## 📋 Executive Summary

This document serves as the definitive guide for implementing API-driven features in the dashboard application. It provides step-by-step instructions, proven patterns, and best practices derived from the successful `sample-complete-api` implementation.

**Target Audience:**
- Frontend developers building new API features
- AI assistants helping with feature development
- Code reviewers ensuring consistency

**Quick Reference:**
- ✅ Complete CRUD operations with real-time feedback
- ✅ Type-safe API integration with comprehensive error handling
- ✅ Reusable component architecture with HeroUI design system
- ✅ Consistent state management using custom React hooks
- ✅ Full navigation integration (routes + sidebar)

---

## 🎯 Core Development Principles

### 1. API-First Development
- **Always start with API analysis** - Understand endpoints, request/response structures, and limitations
- **Type safety first** - Define TypeScript interfaces before implementation
- **Defensive programming** - Handle errors gracefully with user-friendly messages

### 2. Architecture Patterns
- **Separation of Concerns**: API layer → Hooks → Components
- **Single Responsibility**: Each file has one clear purpose
- **Composition over Inheritance**: Reusable components and hooks

### 3. Error Handling Strategy
- **API Level**: Comprehensive error logging with context
- **Hook Level**: User-friendly error messages
- **UI Level**: Graceful fallbacks with retry mechanisms

### 4. State Management Philosophy
- **Local state** for component-specific data
- **Custom hooks** for data fetching and actions
- **Props** for component communication
- **No global state** unless absolutely necessary

### 5. User Experience Standards
- **Loading states** for all async operations
- **Optimistic updates** where possible
- **Toast notifications** for success/error feedback
- **Confirmation dialogs** for destructive actions

---

## 🚀 7-Phase Implementation Guide

### Phase 1: API Analysis & Type Definition

**Objective:** Understand the API and create type-safe interfaces

**Steps:**
1. **Analyze API Documentation**
   - Study all available endpoints
   - Understand request/response formats
   - Note any limitations or special behaviors
   - Test endpoints using tools like Postman/curl

2. **Create `types.ts`**
   ```typescript
   // Core entity interface
   export interface YourEntity {
     id: number;
     // ... all fields from API response
   }
   
   // API response wrapper
   export interface YourEntityResponse {
     items: YourEntity[];      // or 'data', 'results' - match API
     total: number;
     skip?: number;
     limit?: number;
   }
   
   // Request interfaces
   export interface YourEntityCreateRequest {
     // Required fields only
   }
   
   export interface YourEntityUpdateRequest extends Partial<YourEntityCreateRequest> {
     id: number;
   }
   
   // Search/filter parameters
   export interface YourEntitySearchParams {
     q?: string;
     limit?: number;
     skip?: number;
     // ... other filters
   }
   ```

**Template Structure:**
```
src/features/your-feature/
├── types.ts                    # TypeScript interfaces
```

### Phase 2: API Layer Implementation

**Objective:** Create robust API integration with error handling

**Steps:**

1. **Create `api.ts`**
   ```typescript
   import axios from 'axios';
   import type { YourEntity, YourEntityResponse, /* ... other types */ } from './types';
   
   const API_BASE_URL = 'https://your-api.com';
   
   const buildApiUrl = (endpoint: string) => {
     return `${API_BASE_URL}${endpoint}`;
   };
   
   // GET list with search/filter
   export async function fetchYourEntities(params: YourEntitySearchParams = {}): Promise<YourEntityResponse> {
     try {
       // URL building logic
       // Request execution with timeout
       // Response validation
       // Return data
     } catch (error: any) {
       // Comprehensive error handling
       throw new Error(`Failed to fetch: ${error.message}`);
     }
   }
   
   // GET single item
   export async function fetchYourEntityById(id: number): Promise<YourEntity> {
     // Similar pattern
   }
   
   // POST create
   export async function createYourEntity(data: YourEntityCreateRequest): Promise<YourEntity> {
     // Similar pattern
   }
   
   // PUT update
   export async function updateYourEntity(id: number, data: Partial<YourEntityUpdateRequest>): Promise<YourEntity> {
     // Similar pattern
   }
   
   // DELETE
   export async function deleteYourEntity(id: number): Promise<{ id: number; isDeleted: boolean }> {
     // Similar pattern
   }
   ```

2. **Key Implementation Details:**
   - 30-second timeout for all requests
   - Comprehensive error logging with context
   - User-friendly error messages
   - Request/response logging for debugging

**Template Structure:**
```
src/features/your-feature/
├── types.ts
├── api.ts                      # API integration layer
```

### Phase 3: Custom Hooks Development

**Objective:** Create reusable data fetching and action hooks

**Steps:**

1. **Create `hooks.ts`**
   ```typescript
   import { useState, useEffect } from 'react';
   import { fetchYourEntities, /* ... other API functions */ } from './api';
   import type { YourEntity, YourEntityResponse, /* ... */ } from './types';
   
   // Data fetching hook
   export function useYourEntities(params: YourEntitySearchParams = {}) {
     const [data, setData] = useState<YourEntityResponse>({
       items: [],
       total: 0,
       skip: 0,
       limit: 10
     });
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string>('');
   
     const loadData = async (searchParams: YourEntitySearchParams = {}) => {
       try {
         setLoading(true);
         setError('');
         const result = await fetchYourEntities({ ...params, ...searchParams });
         setData(result);
       } catch (err) {
         setError(err instanceof Error ? err.message : 'An error occurred');
       } finally {
         setLoading(false);
       }
     };
   
     useEffect(() => {
       loadData();
     }, [params.limit, params.skip, params.q /* ... dependencies */]);
   
     return {
       data,
       loading,
       error,
       refetch: loadData
     };
   }
   
   // Single item hook
   export function useYourEntity(id: number) {
     // Similar pattern
   }
   
   // Actions hook
   export function useYourEntityActions() {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string>('');
   
     const create = async (data: YourEntityCreateRequest): Promise<YourEntity | null> => {
       // Implementation
     };
   
     const update = async (id: number, data: Partial<YourEntityUpdateRequest>): Promise<YourEntity | null> => {
       // Implementation
     };
   
     const remove = async (id: number): Promise<boolean> => {
       // Implementation
     };
   
     return {
       loading,
       error,
       create,
       update,
       remove
     };
   }
   ```

**Template Structure:**
```
src/features/your-feature/
├── types.ts
├── api.ts
├── hooks.ts                    # Custom React hooks
```

### Phase 4: UI Components Creation

**Objective:** Build reusable, type-safe UI components

**Steps:**

1. **Create Main Page Component**
   ```typescript
   // YourFeaturePage.tsx
   import React, { useState } from 'react';
   import { Button, Input, Select, SelectItem, useDisclosure } from '@heroui/react';
   import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
   import { PageHeader } from '../../components/shared/PageHeader/PageHeader';
   import { DataTable } from '../../components/shared/DataTable/DataTable';
   import { ConfirmationDialog } from '../../components/shared/ConfirmationDialog';
   import { useToast } from '../../components/shared/Toast';
   import { YourEntityForm } from './components/YourEntityForm';
   import { YourEntityDetailModal } from './components/YourEntityDetailModal';
   import { useYourEntities, useYourEntityActions } from './hooks';
   import type { YourEntity, YourEntitySearchParams } from './types';
   
   export const YourFeaturePage: React.FC = () => {
     // State management
     // Hook usage
     // Event handlers
     // Render logic with DataTable
   };
   ```

2. **Create Form Component**
   ```typescript
   // components/YourEntityForm.tsx
   import React, { useState, useEffect } from 'react';
   import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@heroui/react';
   import type { YourEntity, YourEntityCreateRequest, YourEntityUpdateRequest } from '../types';
   
   interface YourEntityFormProps {
     isOpen: boolean;
     onClose: () => void;
     onSave: (data: YourEntityCreateRequest | YourEntityUpdateRequest) => void;
     entity?: YourEntity | null;
     loading?: boolean;
   }
   
   export const YourEntityForm: React.FC<YourEntityFormProps> = ({
     isOpen,
     onClose,
     onSave,
     entity,
     loading = false
   }) => {
     // Form state
     // Validation
     // Submit handling
   };
   ```

3. **Create Detail Modal Component**
   ```typescript
   // components/YourEntityDetailModal.tsx
   import React from 'react';
   import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
   import type { YourEntity } from '../types';
   
   interface YourEntityDetailModalProps {
     isOpen: boolean;
     onClose: () => void;
     entity: YourEntity | null;
     onEdit?: (entity: YourEntity) => void;
     onDelete?: (entity: YourEntity) => void;
   }
   
   export const YourEntityDetailModal: React.FC<YourEntityDetailModalProps> = ({
     isOpen,
     onClose,
     entity,
     onEdit,
     onDelete
   }) => {
     if (!entity) return null;
     
     // Render entity details
   };
   ```

**Template Structure:**
```
src/features/your-feature/
├── types.ts
├── api.ts
├── hooks.ts
├── YourFeaturePage.tsx         # Main page component
└── components/
    ├── YourEntityForm.tsx      # Add/Edit modal
    └── YourEntityDetailModal.tsx # Detail view modal
```

### Phase 5: Route Integration

**Objective:** Add the new feature to the application routing

**Steps:**

1. **Update `App.tsx`**
   ```typescript
   import { YourFeaturePage } from './features/your-feature/YourFeaturePage';
   
   function App() {
     return (
       <Routes>
         <Route path="/login" element={<LoginPage />} />
         <Route path="/register" element={<RegisterPage />} />
   
         <Route path="/" element={<AppLayout />}>
           <Route index element={<DashboardHome />}/>
           <Route path="dashboard" element={<DashboardHome />} />
           {/* ... existing routes ... */}
           <Route path="your-feature" element={<YourFeaturePage />} />  {/* ADD THIS */}
         </Route>
       </Routes>
     );
   }
   ```

**Template Structure:**
```
src/features/your-feature/
├── types.ts
├── api.ts
├── hooks.ts
├── YourFeaturePage.tsx
├── components/
│   ├── YourEntityForm.tsx
│   └── YourEntityDetailModal.tsx
└── README.md                   # Feature documentation
```

### Phase 6: Sidebar Menu Integration

**Objective:** Add navigation menu item with proper icon and active state

**Steps:**

1. **Choose Appropriate Icon**
   - Browse [Lucide React Icons](https://lucide.dev/icons/)
   - Select icon that represents your feature
   - Common choices: `Package` for products, `Users` for people, `FileText` for documents, `Settings` for configuration

2. **Update `src/shared/components/sidebar/Sidebar.tsx`**
   ```typescript
   import SidebarItem from './SidebarItem';
   import { 
     LayoutDashboard, 
     User, 
     Package  // ADD YOUR ICON IMPORT
   } from 'lucide-react';
   
   export default function Sidebar() {
     return (
       <aside className="w-64 bg-gray-800 text-white p-4 space-y-2">
         <h2 className="text-xl font-bold mb-6">My Admin</h2>
         <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
         <SidebarItem icon={User} label="Profile" to="/profile" />
         {/* ADD YOUR MENU ITEM */}
         <SidebarItem icon={Package} label="Your Feature" to="/your-feature" />
       </aside>
     );
   }
   ```

3. **Verify Active State**
   - The `SidebarItem` component automatically handles active state
   - Active state is determined by matching `location.pathname === to`
   - Ensure your route path matches the `to` prop exactly

**Icon Selection Guidelines:**
- `Package` - Products, inventory
- `Users` - User management
- `FileText` - Documents, reports
- `Settings` - Configuration, admin
- `BarChart3` - Analytics, statistics
- `Calendar` - Events, schedules
- `Mail` - Messages, notifications
- `Shield` - Security, permissions

### Phase 7: Testing & Validation

**Objective:** Ensure the feature works correctly and follows standards

**Steps:**

1. **Manual Testing Checklist:**
   - [ ] All CRUD operations work correctly
   - [ ] Search and filtering function properly
   - [ ] Pagination works (if applicable)
   - [ ] Loading states display correctly
   - [ ] Error handling shows appropriate messages
   - [ ] Success toasts appear after actions
   - [ ] Confirmation dialogs work for destructive actions
   - [ ] Form validation prevents invalid submissions
   - [ ] Navigation works (sidebar menu and routes)
   - [ ] Responsive design works on mobile

2. **Code Quality Checklist:**
   - [ ] All functions have proper error handling
   - [ ] TypeScript interfaces are comprehensive
   - [ ] Console logging is appropriate (not excessive)
   - [ ] No unused imports or variables
   - [ ] Consistent naming conventions
   - [ ] Proper component prop interfaces

3. **Performance Checklist:**
   - [ ] API calls have reasonable timeouts
   - [ ] Loading states prevent multiple simultaneous requests
   - [ ] Search includes debouncing (if applicable)
   - [ ] Pagination limits data size
   - [ ] Images have fallback sources

**Final File Structure:**
```
src/features/your-feature/
├── README.md                   # Feature documentation
├── types.ts                    # TypeScript interfaces
├── api.ts                      # API integration layer
├── hooks.ts                    # Custom React hooks
├── YourFeaturePage.tsx         # Main page component
└── components/
    ├── YourEntityForm.tsx      # Add/Edit modal
    └── YourEntityDetailModal.tsx # Detail view modal
```

---

## 🧩 Reusable Code Templates

### API Function Template
```typescript
export async function fetchYourData(params: YourParams = {}): Promise<YourResponse> {
  try {
    const { param1, param2 = 'default' } = params;
    
    let endpoint = `/your-endpoint`;
    const queryParams = new URLSearchParams();
    
    // Build query parameters
    if (param1) queryParams.append('param1', param1);
    if (param2) queryParams.append('param2', param2.toString());
    
    const url = buildApiUrl(endpoint + (queryParams.toString() ? `?${queryParams.toString()}` : ''));
    console.log('🚀 Fetching data from:', url);
    
    const response = await axios.get<YourResponse>(url, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    console.log('✅ Response received:', {
      status: response.status,
      total: response.data.total,
      itemsLength: response.data.items?.length || 0
    });
    
    if (!response.data.items || !Array.isArray(response.data.items)) {
      console.error('❌ Invalid data format:', response.data);
      throw new Error('Invalid data format: expected items array');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('❌ API Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      }
    });
    
    // Standard error handling
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - server took too long to respond');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint not found - check URL configuration');
    } else if (error.response?.status === 403) {
      throw new Error('Access forbidden - check API credentials');
    } else if (error.response?.status === 500) {
      throw new Error('Server error - please try again later');
    } else if (!error.response) {
      throw new Error('Network error - check internet connection');
    }
    
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
}
```

### Data Fetching Hook Template
```typescript
export function useYourData(params: YourParams = {}) {
  const [data, setData] = useState<YourResponse>({
    items: [],
    total: 0,
    skip: 0,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadData = async (searchParams: YourParams = {}) => {
    try {
      setLoading(true);
      setError('');
      const result = await fetchYourData({ ...params, ...searchParams });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.limit, params.skip, params.search /* add relevant dependencies */]);

  return {
    data,
    loading,
    error,
    refetch: loadData
  };
}
```

### Actions Hook Template
```typescript
export function useYourActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const create = async (data: YourCreateRequest): Promise<YourEntity | null> => {
    try {
      setLoading(true);
      setError('');
      const result = await createYourEntity(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, data: Partial<YourUpdateRequest>): Promise<YourEntity | null> => {
    try {
      setLoading(true);
      setError('');
      const result = await updateYourEntity(id, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError('');
      await deleteYourEntity(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    create,
    update,
    remove
  };
}
```

### Main Page Component Template
```typescript
export const YourFeaturePage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<YourSearchParams>({
    limit: 10,
    skip: 0,
    search: ''
  });
  const [selectedItem, setSelectedItem] = useState<YourEntity | null>(null);
  const [itemToDelete, setItemToDelete] = useState<YourEntity | null>(null);

  const { data, loading, error, refetch } = useYourData(searchParams);
  const { loading: actionLoading, create, update, remove } = useYourActions();
  const { success, error: showError, ToastContainer } = useToast();
  
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Event handlers
  const handleSearch = (searchTerm: string) => {
    setSearchParams(prev => ({
      ...prev,
      search: searchTerm,
      skip: 0
    }));
  };

  const handleAdd = () => {
    setSelectedItem(null);
    onFormOpen();
  };

  const handleEdit = (item: YourEntity) => {
    setSelectedItem(item);
    onFormOpen();
  };

  const handleView = (item: YourEntity) => {
    setSelectedItem(item);
    onDetailOpen();
  };

  const handleDelete = (item: YourEntity) => {
    setItemToDelete(item);
    onDeleteOpen();
  };

  const handleSave = async (itemData: any) => {
    try {
      if (selectedItem) {
        const result = await update(selectedItem.id, itemData);
        if (result) {
          success('Item updated successfully');
          onFormClose();
          refetch();
        }
      } else {
        const result = await create(itemData);
        if (result) {
          success('Item created successfully');
          onFormClose();
          refetch();
        }
      }
    } catch (err) {
      showError('Failed to save item');
    }
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      const result = await remove(itemToDelete.id);
      if (result) {
        success('Item deleted successfully');
        onDeleteClose();
        refetch();
      } else {
        showError('Failed to delete item');
      }
    }
  };

  // Define table columns
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  // Render cell content
  const renderCell = (item: YourEntity, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return <span className="font-medium">{item.name}</span>;
      case 'status':
        return <Chip color="success" variant="flat" size="sm">{item.status}</Chip>;
      case 'actions':
        return (
          <div className="flex gap-2">
            <Button isIconOnly variant="light" size="sm" onPress={() => handleView(item)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button isIconOnly variant="light" size="sm" onPress={() => handleEdit(item)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button isIconOnly variant="light" size="sm" color="danger" onPress={() => handleDelete(item)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      default:
        return <span>{String(item[columnKey as keyof YourEntity])}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Your Feature"
        subtitle={`Manage your items (${data.total} total)`}
        actions={
          <Button color="primary" startContent={<Plus className="w-4 h-4" />} onPress={handleAdd}>
            Add Item
          </Button>
        }
      />

      <div className="flex gap-4">
        <Input
          placeholder="Search items..."
          value={searchParams.search || ''}
          onChange={(e) => handleSearch(e.target.value)}
          startContent={<Search className="w-4 h-4" />}
          className="max-w-md"
        />
      </div>

      <DataTable
        data={data.items}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refetch}
        renderCell={renderCell}
        pageSize={searchParams.limit || 10}
      />

      <YourEntityForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        onSave={handleSave}
        entity={selectedItem}
        loading={actionLoading}
      />

      <YourEntityDetailModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        entity={selectedItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
      />

      <ToastContainer />
    </div>
  );
};
```

---

## 🤖 AI Prompt Templates

### Feature Generation Prompt
```
I need to create a new API-driven feature for my dashboard application. Please follow the 7-phase implementation guide from API-README.md.

**API Information:**
- Base URL: [YOUR_API_BASE_URL]
- Available Endpoints:
  - GET /endpoint - List items
  - GET /endpoint/{id} - Get single item
  - POST /endpoint - Create item
  - PUT /endpoint/{id} - Update item
  - DELETE /endpoint/{id} - Delete item

**API Response Format:**
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

**Entity Fields:**
- id: number
- name: string
- status: string
- createdAt: string
- [ADD MORE FIELDS AS NEEDED]

**Feature Requirements:**
- Feature name: [YOUR_FEATURE_NAME]
- Route path: /[your-route]
- Sidebar menu label: [Your Menu Label]
- Sidebar icon: [LucideIconName]
- CRUD operations: [Create/Read/Update/Delete]
- Search functionality: [Yes/No]
- Filtering options: [List any filters]

Please implement this feature following the established patterns and include all 7 phases:
1. Type definitions
2. API layer
3. Custom hooks
4. UI components
5. Route integration
6. Sidebar menu integration
7. Create feature README

Make sure to use the existing shared components (DataTable, PageHeader, ConfirmationDialog, Toast) and follow HeroUI design system patterns.
```

### Bug Fix / Enhancement Prompt
```
I need help with an existing feature based on the sample-complete-api pattern. 

**Feature Location:** src/features/[feature-name]
**Issue Description:** [Describe the problem]
**Expected Behavior:** [What should happen]
**Current Behavior:** [What actually happens]

Please analyze the existing code following the 7-phase architecture and suggest fixes that maintain consistency with the established patterns.

**Debugging Context:**
- Browser console errors: [Include any errors]
- Network tab information: [API call details]
- Component behavior: [What's not working]

Ensure the fix follows our error handling standards and maintains type safety.
```

### Code Review Prompt
```
Please review this API feature implementation against the standards in API-README.md:

**Feature Path:** src/features/[feature-name]

**Review Checklist:**
- [ ] All 7 phases implemented correctly
- [ ] TypeScript interfaces are comprehensive
- [ ] Error handling follows standards
- [ ] API calls have proper timeout and logging
- [ ] Components use shared design system
- [ ] Hooks follow established patterns
- [ ] Route and sidebar integration complete
- [ ] Loading states and user feedback implemented

Please provide specific feedback on any deviations from the established patterns and suggest improvements.
```

---

## 📚 Shared Components Reference

### Available Shared Components

1. **DataTable** (`src/components/shared/DataTable/DataTable.tsx`)
   - Props: `data`, `columns`, `loading`, `error`, `onRetry`, `renderCell`, `pageSize`
   - Features: Built-in search, pagination, loading states, error handling

2. **PageHeader** (`src/components/shared/PageHeader/PageHeader.tsx`)
   - Props: `title`, `subtitle`, `actions`
   - Use for consistent page headers with title, description, and action buttons

3. **ConfirmationDialog** (`src/components/shared/ConfirmationDialog/`)
   - Props: `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmText`, `loading`
   - Use for destructive actions (delete confirmations)

4. **Toast** (`src/components/shared/Toast/`)
   - Hook: `useToast()` returns `{ success, error, info, ToastContainer }`
   - Use for user feedback after actions

### HeroUI Components Used
- `Modal`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter`
- `Button`, `Input`, `Textarea`, `Select`, `SelectItem`
- `Table`, `TableHeader`, `TableColumn`, `TableBody`, `TableRow`, `TableCell`
- `Card`, `CardBody`, `Image`, `Chip`, `Spinner`, `Pagination`
- `useDisclosure` hook for modal state management

---

## 🛠 Development Environment

### Required Dependencies
```json
{
  "dependencies": {
    "@heroui/react": "^2.7.11",
    "axios": "^1.10.0",
    "lucide-react": "^0.525.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^6.30.1"
  },
  "devDependencies": {
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "typescript": "~5.8.3"
  }
}
```

### Build Commands
```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # Code linting
npm run preview    # Preview production build
```

---

## 🎨 Design System Standards

### Colors
- Primary: HeroUI default primary
- Success: `success` color variant
- Warning: `warning` color variant
- Danger: `danger` color variant
- Default: `default` color variant

### Spacing
- Page padding: `p-6`
- Component spacing: `space-y-6`, `space-y-4`
- Grid gaps: `gap-4`, `gap-2`
- Button groups: `flex gap-2`

### Typography
- Page titles: `text-xl font-semibold`
- Section headers: `font-semibold mb-2`
- Body text: `text-small`
- Meta text: `text-tiny text-default-400`

### Component Sizes
- Buttons: `size="sm"` for action buttons
- Inputs: Standard size with `className="max-w-md"` for search
- Icons: `className="w-4 h-4"` or `className="w-5 h-5"`

---

## 🚨 Common Pitfalls & Solutions

### 1. API Response Format Mismatch
**Problem:** API returns different structure than expected
**Solution:** Always validate response structure and adapt interfaces accordingly

### 2. Loading State Management
**Problem:** Multiple simultaneous requests or missing loading states
**Solution:** Use proper loading state in hooks and disable buttons during operations

### 3. Error Handling
**Problem:** Generic error messages that don't help users
**Solution:** Provide context-specific error messages based on HTTP status codes

### 4. Type Safety Issues
**Problem:** Using `any` types or missing interfaces
**Solution:** Define comprehensive TypeScript interfaces for all API data

### 5. Memory Leaks
**Problem:** Async operations continuing after component unmount
**Solution:** Use cleanup functions in useEffect and handle component unmounting

### 6. Search Performance
**Problem:** Search triggering too many API calls
**Solution:** Implement debouncing or use local filtering for small datasets

---

## 📖 Example: Complete Feature Implementation

For a complete working example, refer to the `sample-complete-api` feature located at:
```
src/features/sample-complete-api/
├── README.md                    # Feature-specific documentation
├── types.ts                     # Product interfaces
├── api.ts                       # DummyJSON API integration
├── hooks.ts                     # useProducts, useProductActions hooks
├── SampleCompletePage.tsx       # Main products page
└── components/
    ├── ProductForm.tsx          # Add/Edit product modal
    └── ProductDetailModal.tsx   # Product detail view
```

This implementation demonstrates all the patterns and principles outlined in this guide and serves as the reference standard for new API features.

---

## 📝 Feature Documentation Template

Each feature should include its own README.md with:

```markdown
# [Feature Name] - [Brief Description]

## Features
- [ ] List key features
- [ ] Include CRUD operations
- [ ] Note special functionality

## API Endpoints Used
| Feature | Method | Endpoint | Description |
|---------|--------|----------|-------------|
| List | GET | `/endpoint` | Get paginated list |
| Details | GET | `/endpoint/{id}` | Get single item |
| Create | POST | `/endpoint` | Create new item |
| Update | PUT | `/endpoint/{id}` | Update existing item |
| Delete | DELETE | `/endpoint/{id}` | Delete item |

## File Structure
[Include file tree]

## Usage Examples
[Code examples for using hooks and components]

## Configuration
[Any environment variables or settings]

## Known Limitations
[API limitations or constraints]

## Future Enhancements
[Planned improvements]
```

---

*This document is based on the successful implementation of the `sample-complete-api` feature and should be updated as patterns evolve.*