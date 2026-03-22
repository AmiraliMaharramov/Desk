import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Clock } from "lucide-react";

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

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) return null;

  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: { firstName: true, lastName: true, email: true, phone: true },
      },
      messages: {
        include: {
          sender: { select: { firstName: true, lastName: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      notes: {
        where: { isInternal: false },
        include: {
          author: { select: { firstName: true, lastName: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      survey: true,
    },
  });

  if (!ticket || ticket.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/panel/tickets" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>
          <div className="text-sm text-gray-400 flex items-center gap-2 mt-0.5">
            <span className="font-mono">{ticket.ticketNumber}</span>
            <span>•</span>
            <span>{new Date(ticket.createdAt).toLocaleDateString("tr-TR")}</span>
          </div>
        </div>
        <span className={`ml-auto text-xs px-3 py-1.5 rounded-full font-medium ${statusColors[ticket.status]}`}>
          {statusLabels[ticket.status]}
        </span>
      </div>

      <div className="space-y-5">
        {/* Ticket Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Talep Detayları</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Departman</span>
              <p className="text-gray-900 font-medium mt-0.5">{ticket.department}</p>
            </div>
            <div>
              <span className="text-gray-400">Öncelik</span>
              <p className="text-gray-900 font-medium mt-0.5">{ticket.priority}</p>
            </div>
            <div>
              <span className="text-gray-400">Talep Türü</span>
              <p className="text-gray-900 font-medium mt-0.5">{ticket.ticketType}</p>
            </div>
            {ticket.service && (
              <div>
                <span className="text-gray-400">Hizmet</span>
                <p className="text-gray-900 font-medium mt-0.5">{ticket.service}</p>
              </div>
            )}
            {ticket.slaDeadline && (
              <div>
                <span className="text-gray-400">SLA Son Tarihi</span>
                <p className="text-gray-900 font-medium mt-0.5">
                  {new Date(ticket.slaDeadline).toLocaleString("tr-TR")}
                </p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <span className="text-xs text-gray-400">Mesaj</span>
            <p className="text-sm text-gray-700 mt-1 leading-relaxed">{ticket.message}</p>
          </div>
          {ticket.address && (
            <div className="mt-3">
              <span className="text-xs text-gray-400">Adres</span>
              <p className="text-sm text-gray-700 mt-1">{ticket.address}</p>
            </div>
          )}
          {ticket.deviceInfo && (
            <div className="mt-3">
              <span className="text-xs text-gray-400">Cihaz Bilgisi</span>
              <p className="text-sm text-gray-700 mt-1">{ticket.deviceInfo}</p>
            </div>
          )}
        </div>

        {/* Assigned Technician */}
        {ticket.assignedTo && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Atanan Teknisyen</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                </p>
                <p className="text-xs text-gray-400">{ticket.assignedTo.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages / Chat */}
        {ticket.messages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Mesajlar</h2>
            <div className="space-y-4">
              {ticket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.sender.role === "CUSTOMER" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className={`max-w-sm ${msg.sender.role === "CUSTOMER" ? "items-end" : ""} flex flex-col`}>
                    <div className={`text-xs text-gray-400 mb-1 ${msg.sender.role === "CUSTOMER" ? "text-right" : ""}`}>
                      {msg.sender.firstName} {msg.sender.lastName}
                    </div>
                    <div
                      className={`text-sm px-4 py-2.5 rounded-2xl ${
                        msg.sender.role === "CUSTOMER"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-300">
                      <Clock className="h-3 w-3" />
                      {new Date(msg.createdAt).toLocaleString("tr-TR")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Survey */}
        {ticket.status === "RESOLVED" && ticket.survey && !ticket.survey.completedAt && (
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">Memnuniyet Anketi</h2>
            <p className="text-sm text-blue-700 mb-3">
              Talebiniz çözüldü! Deneyiminizi bizimle paylaşır mısınız?
            </p>
            <Link
              href={`/panel/tickets/${ticket.id}/survey`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Anketi Doldur
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
