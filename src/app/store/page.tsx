export const dynamic = 'force-dynamic';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { ShoppingCart, Star } from "lucide-react";

export default async function StorePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  const categories = await prisma.category.findMany({
    where: { parentId: null },
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Mağaza</h1>
            <p className="text-blue-100 text-lg">
              IT ekipmanları, aksesuarlar ve daha fazlası.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mağaza Yakında Açılıyor</h3>
                <p className="text-gray-500">Şu an ürünler ekleniyor. Çok yakında burada olacak!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <ShoppingCart className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    <div className="p-4">
                      {product.category && (
                        <span className="text-xs text-blue-600 font-medium">{product.category.name}</span>
                      )}
                      <h3 className="text-base font-semibold text-gray-900 mt-1 mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            {product.price.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                          </span>
                          {product.discount && (
                            <span className="ml-2 text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                              -%{product.discount}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500">5.0</span>
                        </div>
                      </div>
                      <button className="w-full mt-3 bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Sepete Ekle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
