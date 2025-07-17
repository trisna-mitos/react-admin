# 🧭 Frontend Dashboard (`fe-dashboard`)

## 🎯 Tujuan Utama

Membangun sistem frontend admin dashboard berbasis **React 19 + TypeScript** dengan pendekatan **feature-based architecture** dan **HeroUI design system**, mengutamakan:

- ✨ **Scalability** – siap untuk pengembangan jangka panjang  
- ⚙️ **Maintainability** – mudah di-maintain oleh tim atau developer baru  
- 🧪 **Testability** – mudah dilakukan unit test dengan renderWithProviders
- 📦 **Dependency Hygiene** – versi dan type declaration selalu konsisten
- 🎨 **Design Consistency** – menggunakan HeroUI sebagai design system utama

---

## 🧱 Teknologi yang Digunakan

| Komponen              | Teknologi                                 | Status      |
|-----------------------|-------------------------------------------|-------------|
| Core Framework        | React 19.1.0 + Vite                      | ✅ Aktif    |
| UI Components         | HeroUI (NextUI fork) 2.x                  | ✅ Aktif    |
| Styling               | Tailwind CSS 3.4 + HeroUI Theme          | ✅ Aktif    |
| Routing               | React Router DOM v6.30.1                 | ✅ Aktif    |
| State Management      | React Query (TanStack) + Zustand         | ✅ Aktif    |
| Form Handling         | React Hook Form + Zod                    | 🔄 Planned  |
| Type Safety           | TypeScript 5.x                           | ✅ Aktif    |
| Testing               | Vitest + Testing Library                  | 🔄 Planned  |

---

## 📁 Struktur Folder (Feature-Based Architecture)

```
fe-dashboard/
├── README.md                    # Project documentation
├── package.json                 # Dependencies and scripts
├── vite.config.ts              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS + HeroUI configuration
├── tsconfig.json               # TypeScript configuration
│
├── public/                     # Static assets
│   └── assets/                 # Images, icons
│
└── src/
    ├── App.tsx                 # Root component with routing
    ├── main.tsx               # Application entry point
    ├── index.css              # Global styles + HeroUI imports
    │
    ├── app/                   # App-level configuration
    │   └── layout/
    │       └── AppLayout.tsx  # Main layout wrapper
    │
    ├── components/            # Shared components
    │   └── shared/           # Reusable app components
    │       ├── PageHeader/   # Page header component
    │       └── DataTable/    # Enhanced table component
    │
    ├── features/             # Feature modules
    │   ├── auth/            # Authentication
    │   │   └── ui/          # Auth pages
    │   │       ├── LoginPage.tsx
    │   │       └── RegisterPage.tsx
    │   │
    │   ├── dashboard/       # Dashboard feature
    │   │   └── ui/
    │   │       └── DashboardHome.tsx
    │   │
    │   ├── example/         # Example components
    │   │   └── ui/
    │   │       ├── FormPage.tsx
    │   │       ├── TablePage.tsx
    │   │       ├── ChartPage.tsx
    │   │       └── GetdataPage.tsx
    │   │
    │   └── rup-data/        # 🎯 RUP Data Feature (Pattern Reference)
    │       ├── RupDataPage.tsx     # Main page component
    │       ├── api.ts              # API service
    │       ├── hooks.ts            # Custom hooks
    │       └── types.ts            # TypeScript interfaces
    │
    ├── services/            # Global services (future)
    ├── hooks/              # Global custom hooks (future)
    ├── utils/              # Utility functions (future)
    └── types/              # Global TypeScript types (future)
```

---

## 🎯 Pattern Reference: Feature `rup-data`

Folder `rup-data` menunjukkan pattern yang sedang digunakan dalam proyek ini:

### Struktur File dalam Feature
```
src/features/rup-data/
├── RupDataPage.tsx    # Main page component
├── api.ts             # API service layer  
├── hooks.ts           # Custom hooks
└── types.ts           # TypeScript interfaces
```

### 1. **Page Component Pattern** (`RupDataPage.tsx`)
```typescript
import React from 'react';
import { Button, Chip } from '@heroui/react';
import { Download, RefreshCw } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader/PageHeader';
import { DataTable } from '../../components/shared/DataTable/DataTable';
import { useRupData } from './hooks';

export default function RupDataPage() {
  const { data, loading, error, refetch } = useRupData();
  
  // Component logic here
  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Data RUP 2025" />
      <DataTable data={data} />
    </div>
  );
}
```

### 2. **API Service Pattern** (`api.ts`)
```typescript
import axios from 'axios';
import type { RupItem } from './types';

const RUP_API_URL = '/rup-api/endpoint/url';

export async function fetchRupData(): Promise<RupItem[]> {
  try {
    const response = await axios.get<RupItem[]>(RUP_API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch RUP data');
  }
}
```

### 3. **Custom Hook Pattern** (`hooks.ts`)
```typescript
import { useState, useEffect } from 'react';
import { fetchRupData } from './api';
import type { RupItem } from './types';

export function useRupData() {
  const [data, setData] = useState<RupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook logic here
  return { data, loading, error, refetch };
}
```

### 4. **Type Definition Pattern** (`types.ts`)
```typescript
export interface RupItem {
  kd_rup: string;
  nama_satker: string;
  nama_paket: string;
  pagu: number;
  metode_pengadaan: string;
  jenis_pengadaan: string;
}
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🎨 HeroUI Integration

### Komponen yang Digunakan
- **Layout**: Card, CardBody, CardHeader, Divider, Spacer
- **Navigation**: Breadcrumbs, Pagination
- **Forms**: Input, Select, Button, Checkbox
- **Data Display**: Table, TableHeader, TableBody, Chip, Badge
- **Feedback**: Modal, Toast, Skeleton, Spinner
- **Icons**: Lucide React icons integration

### Custom Shared Components
1. **PageHeader** - Header standar untuk semua halaman
2. **DataTable** - Wrapper enhanced untuk HeroUI Table dengan:
   - Search functionality
   - Pagination
   - Loading states
   - Error handling
   - Custom cell rendering

---

## 🗂️ Routing Configuration

Routes didefinisikan di `src/App.tsx`:

```typescript
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes inside layout */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardHome />}/>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="form" element={<FormPage />} />
        <Route path="table" element={<TablePage />} />
        <Route path="rup-data" element={<RupDataPage />} />
      </Route>
    </Routes>
  );
}
```

---

## 📋 Development Guidelines

### 1. Membuat Feature Baru
Ikuti pattern yang ada di folder `rup-data`:

```bash
# 1. Buat folder feature
mkdir src/features/new-feature

# 2. Buat file-file standar
touch src/features/new-feature/NewFeaturePage.tsx
touch src/features/new-feature/api.ts
touch src/features/new-feature/hooks.ts
touch src/features/new-feature/types.ts
```

### 2. Naming Conventions
- **Feature folders**: kebab-case (`rup-data`, `user-management`)
- **Page components**: PascalCase dengan suffix `Page` (`RupDataPage.tsx`)
- **API files**: camelCase (`api.ts`, `hooks.ts`, `types.ts`)
- **Interfaces**: PascalCase (`RupItem`, `UserProfile`)

### 3. Import Conventions
```typescript
// ✅ Good: Import HeroUI components
import { Button, Card, Table } from '@heroui/react';

// ✅ Good: Import shared components
import { PageHeader } from '../../components/shared/PageHeader/PageHeader';

// ✅ Good: Import from same feature
import { useRupData } from './hooks';
import type { RupItem } from './types';

// ❌ Avoid: Cross-feature imports
import { useUserData } from '../user-management/hooks';
```

### 4. Component Pattern
```typescript
// Standard page component structure
export default function FeaturePage() {
  // 1. Hooks and state
  const { data, loading, error } = useFeatureData();
  
  // 2. Event handlers
  const handleAction = () => { /* logic */ };
  
  // 3. Render helpers
  const renderCell = (item, key) => { /* rendering */ };
  
  // 4. JSX return
  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Feature Name" />
      {/* component content */}
    </div>
  );
}
```

---

## 🧪 Testing Strategy (Planned)

### Test Structure (Future Implementation)
```
src/features/rup-data/
├── RupDataPage.tsx
├── RupDataPage.test.tsx    # Component tests
├── api.ts
├── api.test.ts             # API tests  
├── hooks.ts
├── hooks.test.ts           # Hook tests
└── types.ts
```

### Test Utilities (Future)
```typescript
// tests/utils/renderWithProviders.tsx
export const renderWithProviders = (ui: React.ReactElement) => {
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={testQueryClient}>
      <HeroUIProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </HeroUIProvider>
    </QueryClientProvider>
  );
  
  return render(ui, { wrapper: Wrapper });
};
```

---

## 🔧 Configuration Files

### Tailwind + HeroUI
```javascript
// tailwind.config.js
import { heroui } from '@heroui/react';

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  plugins: [heroui()],
};
```

### TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "features/*": ["features/*"],
      "components/*": ["components/*"],
      "utils/*": ["utils/*"]
    }
  }
}
```

---

## 🚀 Roadmap & Next Steps

### Immediate Tasks
- [ ] Complete migration all example features to HeroUI
- [ ] Implement proper error boundary components
- [ ] Add form validation with React Hook Form + Zod
- [ ] Setup testing environment with Vitest

### Future Enhancements
- [ ] Add user authentication system
- [ ] Implement global state management with Zustand
- [ ] Add internationalization (i18n) support
- [ ] Setup CI/CD pipeline
- [ ] Add accessibility (a11y) compliance

### Pattern Evolution
- [ ] Expand feature structure when features become complex
- [ ] Add sub-folders (`components/`, `utils/`) within features if needed
- [ ] Consider context providers for complex features
- [ ] Implement proper error handling patterns

---

## 📚 Resources

- [HeroUI Documentation](https://heroui.com/docs)
- [React Query Guide](https://tanstack.com/query/latest)
- [Tailwind CSS Reference](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)

---

## 🤝 Contributing

1. Follow the feature-based architecture pattern shown in `rup-data`
2. Use HeroUI components for all UI elements
3. Keep features self-contained and avoid cross-feature dependencies
4. Update this README when adding new patterns or conventions
5. Follow TypeScript best practices

---

## 📄 License

MIT License - see LICENSE file for details.