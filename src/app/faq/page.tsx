export const dynamic = 'force-dynamic';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { ChevronDown } from "lucide-react";

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const defaultFaqs = [
    {
      question: "Destek almak için sözleşme yapmam gerekiyor mu?",
      answer: "Hayır! QuickFixDesk'in en büyük avantajı sözleşme gerektirmemesidir. İhtiyaç duyduğunuzda tek seferlik destek alabilirsiniz. İsteğe bağlı olarak aylık veya yıllık sözleşme de yapabilirsiniz.",
    },
    {
      question: "Destek talebim ne kadar sürede yanıtlanır?",
      answer: "Ortalama yanıt süremiz 2 saatin altındadır. Kritik öncelikli talepler için bu süre daha da kısalmaktadır.",
    },
    {
      question: "Uzaktan destek nasıl çalışır?",
      answer: "Teknisyenimiz, TeamViewer veya AnyDesk gibi güvenli uzaktan erişim araçlarıyla bilgisayarınıza bağlanarak sorununuzu çözer. Erişim yalnızca siz izin verdiğinizde başlar.",
    },
    {
      question: "Yerinde destek için ne kadar ücret alınır?",
      answer: "Fiyatlar konum ve talep türüne göre değişmektedir. Destek talebi oluşturduktan sonra size net bir fiyat teklifi sunulur.",
    },
    {
      question: "Cihaz tamiri ne kadar sürer?",
      answer: "Basit tamirler genellikle 1-3 iş günü içinde tamamlanır. Parça gerektiren tamirler için süre uzayabilir ancak sizi her aşamada bilgilendiririz.",
    },
    {
      question: "Kurumsal hesap açabilir miyim?",
      answer: "Evet! Kayıt sırasında 'Kurumsal' seçeneğini seçerek firma bilgilerinizle hesap oluşturabilirsiniz. Kurumsal müşterilere özel raporlar ve fatura yönetimi sunulmaktadır.",
    },
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Sık Sorulan Sorular</h1>
            <p className="text-blue-100 text-lg">Merak ettiğiniz soruların yanıtları burada.</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4">
            <div className="space-y-3">
              {displayFaqs.map((faq, index) => (
                <details
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                    <span className="text-base font-medium text-gray-900 pr-4">
                      {"question" in faq ? faq.question : ""}
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {"answer" in faq ? faq.answer : ""}
                    </p>
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sorunuzu bulamadınız mı?</h3>
              <p className="text-gray-500 mb-5 text-sm">
                Canlı destek hattımızdan veya destek talebi oluşturarak bize ulaşabilirsiniz.
              </p>
              <a
                href="/register"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Destek Al
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
