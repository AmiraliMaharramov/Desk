import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserCog } from "lucide-react";

export default async function AdminStaffPage() {
  const session = await auth();
  if (!session) return null;

  const staff = await prisma.user.findMany({
    where: { role: { in: ["STAFF", "ADMIN"] } },
    orderBy: { createdAt: "desc" },
    include: {
      workSchedule: true,
      _count: { select: { staffTickets: true, auditLogs: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Çalışan Yönetimi</h1>
          <p className="text-gray-500 mt-1 text-sm">Çalışanları ekleyin, yetkilendirin ve yönetin.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
          + Yeni Çalışan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {staff.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <UserCog className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz çalışan yok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Ad Soyad</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">E-Posta</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Rol</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Atanan Ticket</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Mesai Kısıtı</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Durum</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {staff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{member.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        member.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {member.role === "ADMIN" ? "Admin" : "Staff"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{member._count.staffTickets}</td>
                    <td className="px-5 py-3 text-sm">
                      {member.workSchedule?.isRestricted ? (
                        <span className="text-xs text-orange-600">
                          {member.workSchedule.startHour}:00 – {member.workSchedule.endHour}:00
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Kısıt yok</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${member.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {member.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-blue-600 hover:underline">Düzenle</button>
                        <button className="text-xs text-red-500 hover:underline">Pasife Al</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
