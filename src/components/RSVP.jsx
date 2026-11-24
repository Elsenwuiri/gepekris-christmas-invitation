import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { supabase } from "../lib/supabase";

const initial = { name: "", whatsapp: "", attendance: "attending", guestCount: "1", message: "" };

export default function RSVP() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!supabase) {
      setStatus({ type: "error", message: "Konfigurasi Supabase belum tersedia." });
      return;
    }

    setLoading(true);
    const { error } = await supabase.rpc("submit_rsvp", {
      p_guest_name: form.name.trim(),
      p_whatsapp: form.whatsapp.trim(),
      p_attendance: form.attendance,
      p_guest_count: form.attendance === "attending" ? Number(form.guestCount) : 0,
      p_message: form.message.trim() || null
    });
    setLoading(false);

    if (error) {
      setStatus({ type: "error", message: error.message || "RSVP gagal dikirim. Silakan coba kembali." });
      return;
    }

    setStatus({
      type: "success",
      message: "Terima kasih! RSVP Anda telah diterima."
    });
    setForm(initial);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field-label">Nama lengkap
          <input required minLength={2} maxLength={120} name="name" value={form.name} onChange={update} placeholder="Nama Anda" className="form-input" />
        </label>
        <label className="field-label">Nomor WhatsApp
          <input required minLength={8} maxLength={24} name="whatsapp" value={form.whatsapp} onChange={update} placeholder="+62..." className="form-input" />
        </label>
      </div>

      <fieldset>
        <legend className="field-label mb-3">Konfirmasi kehadiran</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={`choice-card ${form.attendance === "attending" ? "choice-active" : ""}`}>
            <input type="radio" name="attendance" value="attending" checked={form.attendance === "attending"} onChange={update} />
            <span>Ya, saya akan hadir</span>
          </label>
          <label className={`choice-card ${form.attendance === "not_attending" ? "choice-active" : ""}`}>
            <input type="radio" name="attendance" value="not_attending" checked={form.attendance === "not_attending"} onChange={update} />
            <span>Maaf, tidak dapat hadir</span>
          </label>
        </div>
      </fieldset>

      {form.attendance === "attending" && (
        <label className="field-label">Jumlah tamu termasuk Anda
          <input required type="number" min="1" step="1" name="guestCount" value={form.guestCount} onChange={update} className="form-input sm:max-w-40" />
          <span className="mt-1 block text-xs font-normal text-espresso/55">Tidak ada batas jumlah tamu per RSVP.</span>
        </label>
      )}

      <label className="field-label">Pesan (opsional)
        <textarea maxLength={1000} rows={4} name="message" value={form.message} onChange={update} placeholder="Tuliskan pesan atau ucapan Anda..." className="form-input resize-y" />
      </label>

      {status.message && (
        <div className={`flex items-start gap-2 rounded-xl p-4 text-sm border ${status.type === "success" ? "bg-champagne/10 text-burnt border-antique/25" : "bg-espresso/5 text-espresso border-espresso/25"}`} role="status">
          {status.type === "success" && <CheckCircle2 size={18} className="shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      <button disabled={loading} className="gold-button w-full sm:w-auto" type="submit">
        {loading ? "Mengirim..." : "Kirim RSVP"} <Send size={16} />
      </button>
      <p className="text-xs leading-relaxed text-espresso/55">Informasi RSVP digunakan oleh penyelenggara untuk keperluan acara dan tidak ditampilkan kepada pengunjung website.</p>
    </form>
  );
}