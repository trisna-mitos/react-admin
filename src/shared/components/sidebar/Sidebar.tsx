import SidebarItem from './SidebarItem';
import { LayoutDashboard, User } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 space-y-2">
      <h2 className="text-xl font-bold mb-6">My Admin</h2>
      <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
      <SidebarItem icon={User} label="Profile" to="/profile" />
    </aside>
  );
}
