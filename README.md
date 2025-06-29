# 🧭 Project Prompt – Frontend Orientation (`fe-dashboard`)

## 🎯 Tujuan Utama

Membangun sistem frontend admin dashboard berbasis **React + TypeScript** dengan pendekatan **modular use-case-based architecture**, mengutamakan:

- ✨ **Scalability** – siap untuk pengembangan jangka panjang  
- ⚙️ **Maintainability** – mudah di-maintain oleh tim atau developer baru  
- 🧪 **Testability** – mudah dilakukan unit test  
- 📦 **Dependency Hygiene** – versi dan type declaration selalu konsisten

---

## 🧱 Teknologi yang Digunakan

| Komponen              | Teknologi                                 |
|-----------------------|--------------------------------------------|
| Core Framework        | React 19 + Vite                            |
| Styling               | Tailwind CSS 3.4                           |
| Routing               | React Router DOM v6                        |
| State/Data Handling   | (Akan menggunakan Zustand / React Query)  |
| Form Validation       | (Akan menggunakan Zod / react-hook-form)  |
| Type Safety           | TypeScript 5.x                             |

---

## 📁 Struktur Folder Utama (Use-Case Architecture)

src/
├── app/ # Layout, Routing, Global Provider
├── features/ # Modular per fitur (auth, dashboard, dll)
│ └── auth/
│ ├── ui/ # Komponen halaman Login/Register
│ ├── api/ # AuthService (fetch/axios)
│ └── use-cases/ # Hook logika login/register
├── shared/ # Reusable components, hooks, utils
├── App.tsx # Root dengan BrowserRouter
├── main.tsx # ReactDOM.createRoot
├── index.css # Tailwind entry

---

## 🚨 Catatan Kritis

- Jangan mencampur versi `react-router-dom` v6+ dengan `@types/react-router-dom` v5  
  ✅ Gunakan:

  ```bash
  npm install react-router-dom@6

Jika menggunakan <Routes> dan element={<... />}, maka wajib React Router v6+

Gunakan baseUrl: "baseUrl": "./src"

di dalam tsconfig.json jika ingin import seperti features/auth/...

✅ Best Practices yang Dipakai
Use-case logic terpisah dari UI, mudah di-test mandiri

Routing modular: halaman auth dan halaman utama berbeda layout

Tailwind CSS menggantikan semua CSS manual lama

Setiap fitur (auth, dashboard, dll) dikembangkan secara isolasi

TypeScript adalah standard utama untuk safety dan DX

Simpan file ini sebagai docs/PROJECT_PROMPT.md atau bagian dari README.md utama sebagai acuan kerja tim.

---