import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { TicketIcon, Clock, CheckCircle, AlertCircle, PlusCircle, ArrowRight } from "lucide-react";

export default async function PanelDashboard() {
  const session = await auth();
  if (!session) return null;

  const userId = session.user.id as string;

  const [openTickets, resolvedTickets, recentTickets, announcements] =
    await Promise.all([
      prisma.ticket.count({ where: { userId, status: { in: ["OPEN", "IN_PROGRESS"] } } }),
      prisma.ticket.count({ where: { userId, status: "RESOLVED" } }),
      prisma.ticket.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.announcement.findMany({
        where: { isActive: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
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
    WAITING_CUSTOMER: "Müşteri Yanıtı Bekleniyor",
    RESOLVED: "Çözüldü",
    CLOSED: "Kapatıldı",
  };

  const priorityColors: Record<string, string> = {
    LOW: "text-gray-500",
    MEDIUM: "text-blue-500",
    HIGH: "text-orange-500",
    CRITICAL: "text-red-600 font-semibold",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş geldiniz, {session.user.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Destek taleplerinizi ve hesabınızı buradan yönetebilirsiniz.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Açık Talepler</span>
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <TicketIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{openTickets}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Çözülen Talepler</span>
            <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{resolvedTickets}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Toplam Talepler</span>
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{openTickets + resolvedTickets}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Son Destek Taleplerim</h2>
            <Link href="/panel/tickets" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Tümünü Gör <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentTickets.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <TicketIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Henüz destek talebiniz yok.</p>
              <Link
                href="/panel/tickets/new"
                className="inline-flex items-center gap-2 mt-4 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                İlk Talebinizi Oluşturun
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/panel/tickets/${ticket.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{ticket.subject}</div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                      <span className="font-mono">{ticket.ticketNumber}</span>
                      <span>•</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString("tr-TR")}</span>
                      <span>•</span>
                      <span className={priorityColors[ticket.priority]}>{ticket.priority}</span>
                    </div>
                  </div>
                  <span className={`ml-3 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusColors[ticket.status]}`}>
                    {statusLabels[ticket.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Announcements + Quick Actions */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
            <div className="space-y-2">
              <Link
                href="/panel/tickets/new"
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <PlusCircle className="h-4 w-4" />
                Yeni Destek Talebi
              </Link>
              <Link
                href="/panel/tickets"
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <TicketIcon className="h-4 w-4" />
                Taleplerim
              </Link>
              <Link
                href="/panel/orders"
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <Clock className="h-4 w-4" />
                Sipariş Takibi
              </Link>
            </div>
          </div>

          {/* Announcements */}
          {announcements.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Duyurular</h2>
                <Link href="/panel/announcements" className="text-xs text-blue-600 hover:underline">
                  Tümü
                </Link>
              </div>
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="text-sm">
                    <p className="font-medium text-gray-800">{ann.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {new Date(ann.publishedAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
