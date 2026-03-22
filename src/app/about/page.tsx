import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Target, Eye, Heart, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Biz Kimiz?</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              QuickFixDesk, bireysel ve kurumsal müşterilere sözleşme gerektirmeden profesyonel
              IT desteği sunan yenilikçi bir platformdur.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Eye,
                  title: "Vizyonumuz",
                  color: "blue",
                  content:
                    "Türkiye genelinde IT destek hizmetlerini demokratize etmek; her bireyin ve kurumun kaliteli teknik desteğe kolayca erişebilmesini sağlamak.",
                },
                {
                  icon: Target,
                  title: "Misyonumuz",
                  color: "green",
                  content:
                    "Hızlı, güvenilir ve şeffaf IT destek hizmetleri sunarak müşterilerimizin teknoloji sorunlarını en kısa sürede çözmek ve onların işlerine odaklanmalarını sağlamak.",
                },
                {
                  icon: Heart,
                  title: "Hizmet Anlayışımız",
                  color: "orange",
                  content:
                    "Müşteri memnuniyetini her şeyin önünde tutan, bağlayıcı sözleşmeler yerine güvene dayalı uzun vadeli ilişkiler kuran, şeffaf fiyatlandırma ile çalışan bir anlayış.",
                },
              ].map((item) => {
                const Icon = item.icon;
                const colorClasses: Record<string, string> = {
                  blue: "bg-blue-100 text-blue-600",
                  green: "bg-green-100 text-green-600",
                  orange: "bg-orange-100 text-orange-600",
                };
                return (
                  <div
                    key={item.title}
                    className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
                  >
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${colorClasses[item.color]}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Different */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Bizi Farklı Kılan Nedir?</h2>
            <p className="text-gray-500 mb-10">
              Geleneksel IT destek anlayışını yeniden tanımlıyoruz.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              {[
                {
                  title: "Sözleşme Yok",
                  desc: "İhtiyaç duyduğunuzda destek alın, sözleşmeye bağlı kalmayın.",
                },
                {
                  title: "Şeffaf Fiyat",
                  desc: "Gizli ücret yoktur. Her hizmet için net fiyat bilgisi.",
                },
                {
                  title: "Hızlı Yanıt",
                  desc: "Ortalama 2 saatlik yanıt süresi ile sorunlarınızı hızlıca çözüyoruz.",
                },
                {
                  title: "Sertifikalı Uzmanlar",
                  desc: "Alanında sertifikalı ve deneyimli teknisyen kadromuzla hizmetinizdeyiz.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100">
                  <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
