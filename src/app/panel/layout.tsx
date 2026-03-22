"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Zap,
  LayoutDashboard,
  TicketIcon,
  PlusCircle,
  ShoppingBag,
  Receipt,
  User,
  Bell,
  LogOut,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/panel", label: "Dashboard", icon: LayoutDashboard },
  { href: "/panel/tickets", label: "Destek Taleplerim", icon: TicketIcon },
  { href: "/panel/tickets/new", label: "Yeni Talep Oluştur", icon: PlusCircle },
  { href: "/panel/orders", label: "Sipariş Takibi", icon: ShoppingBag },
  { href: "/panel/accounting", label: "Muhasebe", icon: Receipt },
  { href: "/panel/account", label: "Hesap Bilgileri", icon: User },
  { href: "/panel/announcements", label: "Duyurular", icon: Bell },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-30">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">
              Quick<span className="text-blue-600">Fix</span>Desk
            </span>
          </Link>
          <div className="text-xs text-gray-400 mt-1 ml-8">Müşteri Paneli</div>
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
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                {item.label}
                {isActive && <ChevronRight className="h-3 w-3 ml-auto text-blue-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
          >
            <LogOut className="h-4 w-4 text-gray-400" />
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
