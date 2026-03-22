"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Zap,
  LayoutDashboard,
  TicketIcon,
  Users,
  UserCog,
  ShoppingBag,
  FileText,
  Bell,
  Wrench,
  MessageSquare,
  LogOut,
  ChevronRight,
  Globe,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tickets", label: "Ticket Yönetimi", icon: TicketIcon },
  { href: "/admin/customers", label: "Müşteriler", icon: Users },
  { href: "/admin/staff", label: "Çalışanlar", icon: UserCog },
  { href: "/admin/store", label: "Mağaza Yönetimi", icon: ShoppingBag },
  { href: "/admin/blog", label: "Blog / Bilgi Bankası", icon: FileText },
  { href: "/admin/announcements", label: "Duyurular", icon: Bell },
  { href: "/admin/service", label: "Servis Ekranı", icon: Wrench },
  { href: "/admin/canned-responses", label: "Hazır Cevaplar", icon: MessageSquare },
  { href: "/admin/site", label: "Site Yönetimi", icon: Globe },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col fixed h-full z-30">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold text-white">
              Quick<span className="text-blue-400">Fix</span>Desk
            </span>
          </Link>
          <div className="text-xs text-gray-500 mt-1 ml-8">Admin Paneli</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`} />
                {item.label}
                {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-900/30 hover:text-red-400 w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
