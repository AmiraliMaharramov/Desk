import Link from "next/link";
import { Zap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Zap className="h-7 w-7 text-blue-400" />
              <span className="text-xl font-bold text-white">
                Quick<span className="text-blue-400">Fix</span>Desk
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Aylık/Yıllık anlaşma gerektirmeden profesyonel IT ve cihaz tamir
              desteği sunuyoruz.
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Anasayfa" },
                { href: "/about", label: "Biz Kimiz?" },
                { href: "/store", label: "Mağaza" },
                { href: "/blog", label: "Bilgi Bankası" },
                { href: "/faq", label: "SSS" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Yerinde Destek",
                "Uzaktan Destek",
                "Cihaz Tamiri",
                "Aylık IT Desteği",
                "Kurumsal Çözümler",
              ].map((service) => (
                <li key={service} className="text-gray-400">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+90 (212) 000 00 00</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>destek@quickfixdesk.com</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} QuickFixDesk. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
