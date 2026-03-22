import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Zap,
  Shield,
  Clock,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Monitor,
  Wifi,
  Wrench,
  HeadphonesIcon,
} from "lucide-react";

const stats = [
  { value: "2,400+", label: "Çözülen Destek Talebi" },
  { value: "%98", label: "Müşteri Memnuniyeti" },
  { value: "< 2 Saat", label: "Ort. Yanıt Süresi" },
  { value: "500+", label: "Aktif Müşteri" },
];

const services = [
  {
    icon: Monitor,
    title: "Yerinde Destek",
    description:
      "Uzmanlarımız adresinize gelerek bilgisayar, ağ ve donanım sorunlarınızı çözer.",
    color: "blue",
  },
  {
    icon: Wifi,
    title: "Uzaktan Destek",
    description:
      "Yazılım sorunlarınızı uzaktan bağlantı ile anında çözüyoruz, zaman kaybetmeden.",
    color: "green",
  },
  {
    icon: Wrench,
    title: "Cihaz Tamiri",
    description:
      "Laptop, masaüstü, tablet ve akıllı telefon tamirlerinde profesyonel hizmet.",
    color: "orange",
  },
  {
    icon: HeadphonesIcon,
    title: "7/24 Teknik Destek",
    description:
      "Acil IT sorunlarınız için hafta içi/sonu 7 gün 24 saat destek hattımız açık.",
    color: "purple",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  purple: "bg-purple-100 text-purple-600",
};

const steps = [
  {
    step: "1",
    title: "Üye Ol / Giriş Yap",
    description: "Bireysel veya kurumsal hesap oluşturun.",
  },
  {
    step: "2",
    title: "Destek Talebi Oluştur",
    description: "Sorunuzu tanımlayın ve öncelik belirleyin.",
  },
  {
    step: "3",
    title: "Teknisyen Atanır",
    description: "Uzman teknisyenimiz talebinizi alır ve iletişime geçer.",
  },
  {
    step: "4",
    title: "Sorun Çözülür",
    description: "Sorunuz çözüldükten sonra memnuniyet anketi doldurabilirsiniz.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Slider */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-100 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-blue-400/40">
                <Zap className="h-3.5 w-3.5" />
                Sözleşme Gerektirmeyen IT Desteği
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                IT Sorunlarınızı
                <br />
                <span className="text-blue-200">Hızlıca Çözün</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl">
                Aylık veya yıllık sözleşme olmadan, ihtiyaç duyduğunuzda
                profesyonel IT ve cihaz tamir desteği alın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Ücretsiz Kaydol
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Daha Fazla Bilgi
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Counter Stats */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Hizmetlerimiz</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Bireysel kullanıcılardan kurumsal şirketlere kadar geniş yelpazede IT destek hizmetleri.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => {
                const Icon = service.icon;
                const colorClass = colorMap[service.color];
                return (
                  <div
                    key={service.title}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${colorClass}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nasıl Çalışır?</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Sadece birkaç adımda destek alın.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={step.step} className="relative text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold mb-4 shadow-lg shadow-blue-200">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-7 left-[calc(50%+2rem)] right-0 h-0.5 bg-blue-100" />
                  )}
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Neden QuickFixDesk?</h2>
                <div className="space-y-4">
                  {[
                    "Sözleşme yok, bağlayıcılık yok – sadece ihtiyaç duyduğunuzda.",
                    "Sertifikalı ve deneyimli teknisyen kadrosu.",
                    "Hızlı yanıt süresi ve SLA garantisi.",
                    "Yerinde, uzaktan ve servis desteği seçenekleri.",
                    "7/24 online destek talebi açma imkânı.",
                    "Şeffaf fiyatlandırma, gizli ücret yok.",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-200 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-100">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: "Güvenli", desc: "Verileriniz güvende" },
                  { icon: Clock, title: "Hızlı", desc: "Ortalama 2 saat yanıt" },
                  { icon: Star, title: "Kaliteli", desc: "%98 müşteri memnuniyeti" },
                  { icon: Users, title: "Profesyonel", desc: "Sertifikalı ekip" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20">
                      <Icon className="h-8 w-8 text-blue-200 mb-3" />
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-blue-200">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hemen Destek Almaya Başlayın</h2>
            <p className="text-gray-500 mb-8">
              Ücretsiz kayıt olun ve dakikalar içinde destek talebi oluşturun. Sözleşme yok, ön ödeme yok.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Üye Ol – Ücretsiz
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
