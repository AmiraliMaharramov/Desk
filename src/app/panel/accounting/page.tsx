import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Receipt } from "lucide-react";

export default async function AccountingPage() {
  const session = await auth();
  if (!session) return null;

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id as string },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Muhasebe</h1>
        <p className="text-gray-500 mt-1 text-sm">Geçmiş faturalarınızı görüntüleyin.</p>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-16 text-center">
          <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz faturanız yok</h3>
          <p className="text-gray-500 text-sm">Hizmet aldığınızda faturalarınız burada görünecek.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Fatura No</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Tutar</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">KDV</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Toplam</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Ödeme Durumu</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Tarih</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">İndir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono text-gray-700">{invoice.invoiceNumber}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {invoice.amount.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {invoice.taxAmount.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                    </td>
                    <td className="px-5 py-3 text-sm font-bold text-gray-900">
                      {invoice.totalAmount.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${invoice.paidAt ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {invoice.paidAt ? "Ödendi" : "Ödeme Bekliyor"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {new Date(invoice.issuedAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-5 py-3">
                      {invoice.filePath ? (
                        <a href={invoice.filePath} className="text-xs text-blue-600 hover:underline">İndir</a>
                      ) : (
                        <span className="text-gray-300 text-xs">–</span>
                      )}
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
