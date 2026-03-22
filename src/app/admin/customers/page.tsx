import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Building2, User } from "lucide-react";

export default async function AdminCustomersPage() {
  const session = await auth();
  if (!session) return null;

  const [individuals, corporates] = await Promise.all([
    prisma.user.findMany({
      where: { role: "CUSTOMER", userType: "INDIVIDUAL" },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { tickets: true, orders: true } } },
    }),
    prisma.user.findMany({
      where: { role: "CUSTOMER", userType: "CORPORATE" },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { tickets: true, orders: true } } },
    }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Müşteri Yönetimi</h1>
        <p className="text-gray-500 mt-1 text-sm">Bireysel ve kurumsal müşterileri yönetin.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{individuals.length + corporates.length}</div>
              <div className="text-sm text-gray-500">Toplam Müşteri</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{individuals.length}</div>
              <div className="text-sm text-gray-500">Bireysel</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{corporates.length}</div>
              <div className="text-sm text-gray-500">Kurumsal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      {[
        { title: "Bireysel Müşteriler", customers: individuals, icon: User },
        { title: "Kurumsal Müşteriler", customers: corporates, icon: Building2 },
      ].map(({ title, customers, icon: Icon }) => (
        <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <Icon className="h-4 w-4 text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-1">{customers.length}</span>
          </div>
          {customers.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Kayıt yok.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Ad Soyad</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">E-Posta</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Telefon</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Firma</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Ticket</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Sipariş</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Durum</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Kayıt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">{customer.email}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{customer.phone || "–"}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{customer.companyName || "–"}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{customer._count.tickets}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{customer._count.orders}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${customer.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {customer.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-400">
                        {new Date(customer.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
