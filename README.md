🎯 Tujuan Utama
Membangun sistem frontend admin dashboard berbasis React + TypeScript dengan pendekatan modular use-case-based architecture, mengutamakan:

✨ Scalability (siap untuk pengembangan jangka panjang)

⚙️ Maintainability (mudah di-maintain oleh tim atau developer baru)

🧪 Testability (mudah di-unit test)

📦 Dependency hygiene (versi dan type declaration selalu konsisten)

🧱 Teknologi yang Digunakan
Komponen	Teknologi
Core Framework	React 19 + Vite
Styling	Tailwind CSS 3.4
Routing	React Router DOM v6
State/Data Handling	(Akan menggunakan Zustand / React Query)
Form Validation	(Akan menggunakan Zod / react-hook-form)
Type Safety	TypeScript 5.x

📁 Struktur Folder Utama (Use-Case Architecture)
pgsql
Copy
Edit
src/
├── app/                → Layout, Routing, Global Provider
├── features/           → Modular per fitur (auth, dashboard, dll)
│   └── auth/
│       ├── ui/         → Komponen halaman Login/Register
│       ├── api/        → AuthService (fetch/axios)
│       └── use-cases/  → Hook logika login/register
├── shared/             → Reusable components, hooks, utils
├── App.tsx             → Root dengan BrowserRouter
├── main.tsx            → ReactDOM.createRoot
├── index.css           → Tailwind entry
🚨 Catatan Kritis
Jangan mencampur versi react-router-dom v6+ dengan @types/react-router-dom v5.
✅ Gunakan:

bash
Copy
Edit
npm install react-router-dom@6
Jika menggunakan element={<... />} dan <Routes>, maka wajib React Router v6+

Gunakan baseUrl: "./src" di tsconfig.json jika ingin import seperti features/auth/...

✅ Best Practice yang Dipakai
Use-case logic terpisah dari UI, bisa di-test mandiri

Routing modular: halaman auth dan halaman utama berbeda layout

Tailwind CSS menggantikan semua CSS manual lama

Setiap fitur (auth, dashboard, dll) dikembangkan secara isolasi

TypeScript sebagai standard

