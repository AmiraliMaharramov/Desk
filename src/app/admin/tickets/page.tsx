import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { TicketIcon } from "lucide-react";

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
  MEDIUM: "text-blue-600",
  HIGH: "text-orange-500",
  CRITICAL: "text-red-600 font-bold",
};

export default async function AdminTicketsPage() {
  const session = await auth();
  if (!session) return null;

  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      assignedTo: { select: { firstName: true, lastName: true } },
    },
  });

  const staffList = await prisma.user.findMany({
    where: { role: { in: ["STAFF", "ADMIN"] } },
    select: { id: true, firstName: true, lastName: true },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ticket Yönetimi</h1>
        <p className="text-gray-500 mt-1 text-sm">Tüm destek taleplerini görüntüleyin ve yönetin.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {["Tümü", "OPEN", "IN_PROGRESS", "WAITING_CUSTOMER", "RESOLVED", "CLOSED"].map((status) => (
          <Link
            key={status}
            href={status === "Tümü" ? "/admin/tickets" : `/admin/tickets?status=${status}`}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              status === "Tümü"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {status === "Tümü" ? "Tümü" : statusLabels[status]}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {tickets.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <TicketIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz ticket yok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Talep No</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Konu</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Müşteri</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Departman</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Atanan</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Öncelik</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Durum</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">SLA</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.map((ticket) => {
                  const slaBreached =
                    ticket.slaDeadline &&
                    new Date(ticket.slaDeadline) < new Date() &&
                    !["RESOLVED", "CLOSED"].includes(ticket.status);
                  return (
                    <tr key={ticket.id} className={`hover:bg-gray-50 transition-colors ${slaBreached ? "bg-red-50/50" : ""}`}>
                      <td className="px-5 py-3">
                        <Link href={`/admin/tickets/${ticket.id}`} className="text-blue-600 hover:underline text-sm font-mono">
                          {ticket.ticketNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700 max-w-[180px] truncate">{ticket.subject}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">
                        {ticket.user.firstName} {ticket.user.lastName}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">{ticket.department}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {ticket.assignedTo
                          ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                          : <span className="text-red-400 text-xs font-medium">Atanmadı</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-sm ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[ticket.status]}`}>
                          {statusLabels[ticket.status]}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {slaBreached ? (
                          <span className="text-xs text-red-600 font-medium">İhlal!</span>
                        ) : ticket.slaDeadline ? (
                          <span className="text-xs text-gray-400">
                            {new Date(ticket.slaDeadline).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                          </span>
                        ) : <span className="text-gray-300">–</span>}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Staff list for reference */}
      <div className="mt-6 text-xs text-gray-400">
        {staffList.length > 0 && (
          <p>Mevcut çalışanlar: {staffList.map(s => `${s.firstName} ${s.lastName}`).join(", ")}</p>
        )}
      </div>
    </div>
  );
}
