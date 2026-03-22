"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Monitor, Wifi, Wrench } from "lucide-react";

type TicketType = "GENERAL" | "ONSITE" | "REMOTE" | "DEVICE";

const departments = [
  "Yazılım Desteği",
  "Donanım Desteği",
  "Ağ / İnternet",
  "Güvenlik",
  "Bulut Hizmetleri",
  "Cihaz Tamiri",
  "Genel Destek",
];

const priorities = [
  { value: "LOW", label: "Düşük" },
  { value: "MEDIUM", label: "Orta" },
  { value: "HIGH", label: "Yüksek" },
  { value: "CRITICAL", label: "Kritik" },
];

const ticketTypes = [
  { value: "GENERAL", label: "Genel Destek", icon: Monitor, desc: "Genel IT destek talebi." },
  { value: "ONSITE", label: "Yerinde Destek", icon: MapPin, desc: "Teknisyen adresinize gelir." },
  { value: "REMOTE", label: "Uzaktan Destek", icon: Wifi, desc: "Uzaktan bağlantı ile destek." },
  { value: "DEVICE", label: "Cihaz Desteği", icon: Wrench, desc: "Cihaz tamir/bakım talebi." },
];

export default function NewTicketPage() {
  const router = useRouter();
  const [ticketType, setTicketType] = useState<TicketType>("GENERAL");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    department: "",
    service: "",
    priority: "MEDIUM",
    subject: "",
    message: "",
    address: "",
    deviceInfo: "",
    remoteToolInfo: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.department || !form.subject || !form.message) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ticketType }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Talep oluşturulurken bir hata oluştu.");
      } else {
        router.push(`/panel/tickets/${data.id}`);
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Destek Talebi</h1>
        <p className="text-gray-500 mt-1 text-sm">Destek talebinizle ilgili detayları doldurun.</p>
      </div>

      {/* Ticket Type Selection */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {ticketTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => setTicketType(type.value as TicketType)}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
                ticketType === type.value
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${ticketType === type.value ? "text-blue-600" : "text-gray-400"}`} />
              <div>
                <div className={`text-sm font-medium ${ticketType === type.value ? "text-blue-700" : "text-gray-700"}`}>
                  {type.label}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{type.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Departman <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Seçiniz...</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Öncelik</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">İlgili Hizmet / Talep</label>
            <input
              type="text"
              name="service"
              value={form.service}
              onChange={handleChange}
              placeholder="Örn: Windows kurulumu, Yazıcı kurulumu..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Konu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="Talebinizi kısaca açıklayın"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mesaj <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Sorununuzu detaylı olarak açıklayın..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Onsite: Address */}
          {ticketType === "ONSITE" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Adres <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Tam adresinizi girin"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Device: Device Info */}
          {(ticketType === "DEVICE" || ticketType === "ONSITE") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cihaz Bilgisi</label>
              <input
                type="text"
                name="deviceInfo"
                value={form.deviceInfo}
                onChange={handleChange}
                placeholder="Marka, model, seri no..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Remote: Tool Info */}
          {ticketType === "REMOTE" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Uzaktan Destek Programı Bilgisi</label>
              <input
                type="text"
                name="remoteToolInfo"
                value={form.remoteToolInfo}
                onChange={handleChange}
                placeholder="TeamViewer ID, AnyDesk ID vb."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Talep Oluştur
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
