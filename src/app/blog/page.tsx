export const dynamic = 'force-dynamic';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Calendar, ArrowRight } from "lucide-react";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Bilgi Bankası</h1>
            <p className="text-blue-100 text-lg">
              IT rehberleri, ipuçları ve teknik makaleler.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">İçerik Yakında Geliyor</h3>
                <p className="text-gray-500">Faydalı IT rehberleri ve makaleler çok yakında burada olacak.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-blue-200" />
                      </div>
                    )}
                    <div className="p-5">
                      {post.category && (
                        <span className="text-xs text-blue-600 font-medium">{post.category.name}</span>
                      )}
                      <h3 className="text-base font-semibold text-gray-900 mt-1 mb-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("tr-TR")
                            : ""}
                        </div>
                        <span className="text-xs text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                          Devamını Oku <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
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
