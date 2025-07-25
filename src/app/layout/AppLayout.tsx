/*import DrawerBackdrop from "./drawer-backdrop";
import DrawerSidebar from "./drawer-sidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <DrawerSidebar />
      <h1 className="text-2xl font-bold mb-4">Welcome to My App</h1>
      <p>Click the menu icon in the top left corner to open the navigation drawer.</p>
    </div>
  );
}*/

import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import DrawerSidebar, { type DrawerSidebarProps } from './drawer-sidebar';

export default function AppLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [responsive, setResponsive] = useState(false);

  console.log(responsive)

  const  a: DrawerSidebarProps = {
    content: "jal",
    tittle: "88"
  };

  console.log("dari sini",location.pathname)
  let pageTitle = 'Page Title'; // Default title
  if (location.pathname === '/' || location.pathname === '/dashboard') {
      pageTitle = 'Dashboard';
    } else if (location.pathname === '/about') {
      pageTitle = 'About';
    } else if (location.pathname === '/contact') {
      pageTitle = 'Contact';
    } else if (location.pathname === '/products') {
      pageTitle = 'Products';
    } else if (location.pathname === '/rup-data') {
      pageTitle = 'RUP Data';
    }
  //  useEffect(() => {
    
  //   const handleResize = () => {
  //     setResponsive(window.innerWidth < 768);
  //   };

  //   window.addEventListener('resize', handleResize);

  //   handleResize();

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white w-64 transition-transform transform ${responsive ? 'hidden' : ''} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static h-full z-40 top-0 left-0`}>
        <div className="p-4 font-bold text-xl border-b border-gray-700">App</div>
        <nav className="p-4 space-y-2">
          <Link to="/" className="block p-2 rounded hover:bg-gray-700">Dashboard</Link>
          <Link to="/form" className="block p-2 rounded hover:bg-gray-700">Form</Link>
          <Link to="/chart" className="block p-2 rounded hover:bg-gray-700">Chart</Link>
          <Link to="/table" className="block p-2 rounded hover:bg-gray-700">Table</Link>
          <Link to="/rup" className="block p-2 rounded hover:bg-gray-700">Get Rup</Link>
          <Link to="/rup-data" className="block p-2 rounded hover:bg-gray-700">Rup Data</Link>
          <Link to="/products" className="block p-2 rounded hover:bg-gray-700">Products</Link>
        </nav>
      </aside>
      <div className={`${responsive ? '' : 'hidden'}`}>
        <DrawerSidebar
          tittle="djajaj"
          content='bla'
        />
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-md px-4 py-2 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">{pageTitle}</h1>
          <div>User Menu</div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="bg-white p-6 rounded shadow">
            <Outlet />
          </div>
            
        </main>
      </div>
    </div>
  );
}
