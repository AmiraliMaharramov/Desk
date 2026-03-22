import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Bell } from "lucide-react";

export default async function AnnouncementsPage() {
  const session = await auth();
  if (!session) return null;

  const announcements = await prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Duyurular</h1>
        <p className="text-gray-500 mt-1 text-sm">Platform duyuruları ve güncellemeler.</p>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-16 text-center">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz duyuru yok</h3>
          <p className="text-gray-500 text-sm">Yeni duyurular burada görünecek.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div key={ann.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-gray-900">{ann.title}</h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(ann.publishedAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{ann.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
