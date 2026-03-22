import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  TicketIcon,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Activity,
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) return null;

  const now = new Date();

  const [
    openTickets,
    inProgressTickets,
    resolvedToday,
    slaViolations,
    totalCustomers,
    recentTickets,
    staffCount,
  ] = await Promise.all([
    prisma.ticket.count({ where: { status: "OPEN" } }),
    prisma.ticket.count({ where: { status: "IN_PROGRESS" } }),
    prisma.ticket.count({
      where: {
        status: "RESOLVED",
        resolvedAt: { gte: new Date(now.setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.ticket.count({
      where: {
        slaDeadline: { lt: new Date() },
        status: { notIn: ["RESOLVED", "CLOSED"] },
      },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: { select: { firstName: true, lastName: true } },
        assignedTo: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.user.count({ where: { role: { in: ["STAFF", "ADMIN"] } } }),
  ]);

  const statusColors: Record<string, string> = {
    OPEN: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    WAITING_CUSTOMER: "bg-orange-100 text-orange-700",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-100 text-gray-700",
  };

  const statusLabels: Record<string, string> = {
    OPEN: "Açık",
    IN_PROGRESS: "İşlemde",
    WAITING_CUSTOMER: "Müşteri Yanıtı Bek.",
    RESOLVED: "Çözüldü",
    CLOSED: "Kapatıldı",
  };

  const priorityColors: Record<string, string> = {
    LOW: "text-gray-500",
    MEDIUM: "text-blue-600",
    HIGH: "text-orange-500",
    CRITICAL: "text-red-600 font-bold",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Hoş geldiniz, {session.user?.name} • {new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Açık Ticketlar", value: openTickets, icon: TicketIcon, color: "blue", link: "/admin/tickets?status=OPEN" },
          { label: "İşlemdeki Ticketlar", value: inProgressTickets, icon: Activity, color: "yellow", link: "/admin/tickets?status=IN_PROGRESS" },
          { label: "Bugün Çözüldü", value: resolvedToday, icon: CheckCircle, color: "green", link: "/admin/tickets?status=RESOLVED" },
          { label: "SLA İhlalleri", value: slaViolations, icon: AlertTriangle, color: "red", link: "/admin/tickets" },
        ].map((stat) => {
          const Icon = stat.icon;
          const colorMap: Record<string, string> = {
            blue: "bg-blue-100 text-blue-600",
            yellow: "bg-yellow-100 text-yellow-600",
            green: "bg-green-100 text-green-600",
            red: "bg-red-100 text-red-600",
          };
          return (
            <Link
              key={stat.label}
              href={stat.link}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </Link>
          );
        })}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        {[
          { label: "Toplam Müşteri", value: totalCustomers, icon: Users, link: "/admin/customers" },
          { label: "Aktif Çalışanlar", value: staffCount, icon: TrendingUp, link: "/admin/staff" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.link}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Icon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            Son Destek Talepleri
          </h2>
          <Link href="/admin/tickets" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            Tümünü Yönet <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Talep No</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Konu</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Müşteri</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Atanan</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Öncelik</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Durum</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/tickets/${ticket.id}`} className="text-blue-600 hover:underline text-sm font-mono">
                      {ticket.ticketNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700 max-w-[200px] truncate">{ticket.subject}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {ticket.user.firstName} {ticket.user.lastName}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {ticket.assignedTo
                      ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                      : <span className="text-gray-300">–</span>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-sm ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[ticket.status]}`}>
                      {statusLabels[ticket.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
