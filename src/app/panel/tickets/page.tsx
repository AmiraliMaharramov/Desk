import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, TicketIcon } from "lucide-react";

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

const priorityLabels: Record<string, string> = {
  LOW: "Düşük",
  MEDIUM: "Orta",
  HIGH: "Yüksek",
  CRITICAL: "Kritik",
};

const priorityColors: Record<string, string> = {
  LOW: "text-gray-500",
  MEDIUM: "text-blue-500",
  HIGH: "text-orange-500",
  CRITICAL: "text-red-600 font-bold",
};

export default async function TicketsPage() {
  const session = await auth();
  if (!session) return null;

  const tickets = await prisma.ticket.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destek Taleplerim</h1>
          <p className="text-gray-500 mt-1 text-sm">Tüm destek taleplerinizi buradan takip edebilirsiniz.</p>
        </div>
        <Link
          href="/panel/tickets/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Yeni Talep
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-16 text-center">
          <TicketIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz destek talebiniz yok</h3>
          <p className="text-gray-500 text-sm mb-6">İlk destek talebinizi oluşturmak için aşağıdaki butona tıklayın.</p>
          <Link
            href="/panel/tickets/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Yeni Talep Oluştur
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Talep No</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Konu</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Departman</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Öncelik</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Durum</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/panel/tickets/${ticket.id}`} className="text-blue-600 hover:underline text-sm font-mono">
                        {ticket.ticketNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/panel/tickets/${ticket.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                        {ticket.subject}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{ticket.department}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm ${priorityColors[ticket.priority]}`}>
                        {priorityLabels[ticket.priority]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[ticket.status]}`}>
                        {statusLabels[ticket.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
