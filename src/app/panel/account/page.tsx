"use client";

import { useState } from "react";
import { Loader2, User, Lock, MapPin, Building2, Bell } from "lucide-react";

type Tab = "personal" | "security" | "addresses" | "corporate" | "notifications";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "personal", label: "Kişisel Bilgiler", icon: User },
    { id: "security", label: "Güvenlik", icon: Lock },
    { id: "addresses", label: "Adresler", icon: MapPin },
    { id: "corporate", label: "Kurumsal Bilgiler", icon: Building2 },
    { id: "notifications", label: "Bildirimler", icon: Bell },
  ];

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hesap Bilgileri</h1>
        <p className="text-gray-500 mt-1 text-sm">Kişisel bilgilerinizi ve tercihlerinizi güncelleyin.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 p-1 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-5">
            Değişiklikler kaydedildi.
          </div>
        )}

        {activeTab === "personal" && (
          <form onSubmit={handleSave} className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad</label>
                <input type="text" placeholder="Adınız" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Soyad</label>
                <input type="text" placeholder="Soyadınız" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-Posta</label>
              <input type="email" placeholder="E-posta adresiniz" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon Numarası</label>
              <input type="tel" placeholder="05XX XXX XX XX" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Değişiklikleri Kaydet
            </button>
          </form>
        )}

        {activeTab === "security" && (
          <form onSubmit={handleSave} className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Şifre Değiştir</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mevcut Şifre</label>
              <input type="password" placeholder="Mevcut şifreniz" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Yeni Şifre</label>
              <input type="password" placeholder="Yeni şifreniz" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Yeni Şifre Tekrar</label>
              <input type="password" placeholder="Yeni şifrenizi tekrar girin" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Şifremi Güncelle
            </button>
          </form>
        )}

        {activeTab === "addresses" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Adreslerim</h2>
              <button className="text-sm text-blue-600 hover:underline">+ Adres Ekle</button>
            </div>
            <div className="text-center py-8">
              <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Henüz kayıtlı adresiniz yok.</p>
            </div>
          </div>
        )}

        {activeTab === "corporate" && (
          <form onSubmit={handleSave} className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Kurumsal Bilgiler</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Firma Adı</label>
              <input type="text" placeholder="Firma Adı" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Vergi Dairesi</label>
                <input type="text" placeholder="Vergi Dairesi" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Vergi Numarası</label>
                <input type="text" placeholder="Vergi No" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fatura Unvanı</label>
              <input type="text" placeholder="Fatura Unvanı" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fatura Adresi</label>
              <input type="text" placeholder="Fatura Adresi" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Kaydet
            </button>
          </form>
        )}

        {activeTab === "notifications" && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Bildirim Seçenekleri</h2>
            <div className="space-y-4">
              {[
                { label: "Ticket durum güncellemeleri", desc: "Ticket durumu değiştiğinde bildirim al" },
                { label: "Yeni mesajlar", desc: "Teknisyen mesaj gönderdiğinde bildirim al" },
                { label: "Memnuniyet anketleri", desc: "Anket e-posta hatırlatmaları" },
                { label: "Duyurular", desc: "Platform duyurularından haberdar ol" },
              ].map((item) => (
                <label key={item.label} className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-1 rounded" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            <button onClick={handleSave} disabled={isSaving} className="mt-5 bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Tercihleri Kaydet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
