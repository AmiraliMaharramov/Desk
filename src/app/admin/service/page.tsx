import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Wrench } from "lucide-react";

const deviceStatusLabels: Record<string, string> = {
  RECEIVED: "Teslim Alındı",
  INSPECTING: "İncelemede",
  WAITING_PARTS: "Parça Bekliyor",
  REPAIRED: "Tamir Edildi",
  DELIVERED: "Teslim Edildi",
  PRICE_APPROVAL: "Fiyat Onayı Bekliyor",
};

const deviceStatusColors: Record<string, string> = {
  RECEIVED: "bg-blue-100 text-blue-700",
  INSPECTING: "bg-yellow-100 text-yellow-700",
  WAITING_PARTS: "bg-orange-100 text-orange-700",
  REPAIRED: "bg-green-100 text-green-700",
  DELIVERED: "bg-gray-100 text-gray-700",
  PRICE_APPROVAL: "bg-purple-100 text-purple-700",
};

export default async function AdminServicePage() {
  const session = await auth();
  if (!session) return null;

  const devices = await prisma.serviceDevice.findMany({
    orderBy: { receivedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servis Ekranı</h1>
          <p className="text-gray-500 mt-1 text-sm">Servisteki cihazları takip edin.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
          + Cihaz Ekle
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
        {Object.entries(deviceStatusLabels).map(([status, label]) => {
          const count = devices.filter((d) => d.status === status).length;
          return (
            <div key={status} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
              <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${deviceStatusColors[status]}`}>{label}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {devices.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Serviste cihaz yok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Cihaz</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Model</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Seri No</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Durum</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Teslim Alındı</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Garanti</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">QR</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {devices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{device.deviceName}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{device.deviceModel || "–"}</td>
                    <td className="px-5 py-3 text-sm font-mono text-gray-500">{device.serialNumber || "–"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${deviceStatusColors[device.status]}`}>
                        {deviceStatusLabels[device.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {new Date(device.receivedAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {device.warrantyExpiry
                        ? new Date(device.warrantyExpiry).toLocaleDateString("tr-TR")
                        : "–"}
                    </td>
                    <td className="px-5 py-3">
                      <button className="text-xs text-blue-600 hover:underline">QR Oluştur</button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-blue-600 hover:underline">Güncelle</button>
                        <button className="text-xs text-green-600 hover:underline">Teslim Et</button>
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
