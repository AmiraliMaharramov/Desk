import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShoppingBag } from "lucide-react";

const orderStatusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  PROCESSING: "İşleniyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

const orderStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Sipariş Takibi</h1>
        <p className="text-gray-500 mt-1 text-sm">Aktif ve geçmiş siparişlerinizi takip edin.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-16 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz siparişiniz yok</h3>
          <p className="text-gray-500 text-sm">Mağazamızdan ürün satın aldığınızda siparişleriniz burada görünecek.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-mono text-gray-500">{order.orderNumber}</span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${orderStatusColors[order.status]}`}>
                    {orderStatusLabels[order.status]}
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {order.totalAmount.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-50 pt-3">
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.product.name}</span>
                      <span className="text-gray-500">x{item.quantity} — {(item.price * item.quantity).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
