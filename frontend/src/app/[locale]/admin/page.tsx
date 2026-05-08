"use client";

import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-dc32.up.railway.app";
const ADMIN_PASSWORD = "lapassion2024";

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string | null;
  status: string;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã huỷ",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/reservations`);
      if (res.ok) setReservations(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchReservations();
  }, [authed, fetchReservations]);

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else setPwError(true);
  };

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`${API_URL}/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReservations(prev => prev.map(r => r.id === id ? updated : r));
      }
    } finally {
      setUpdating(null);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="section-label text-center mb-2">Admin</p>
          <h1 className="font-serif text-3xl text-white font-light text-center mb-8">La Passion</h1>
          <div className="border border-white/10 p-8">
            <label className="section-label text-[9px] block mb-3">Mật khẩu</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              placeholder="••••••••"
              className="input-field mb-2"
              autoFocus
            />
            {pwError && <p className="text-red-400 text-[10px] mb-4">Mật khẩu không đúng</p>}
            <button onClick={login} className="btn-primary w-full justify-center mt-4">
              <span>Đăng nhập</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const counts = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === "pending").length,
    confirmed: reservations.filter(r => r.status === "confirmed").length,
    cancelled: reservations.filter(r => r.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-navy-deep border-b border-gold/10 px-6 py-5 flex items-center justify-between">
        <div>
          <p className="section-label text-[9px]">Admin Dashboard</p>
          <h1 className="font-serif text-2xl font-light text-white mt-0.5">Quản lý Đặt Bàn</h1>
        </div>
        <button onClick={fetchReservations} disabled={loading}
          className="text-white/40 hover:text-gold text-xs tracking-widest uppercase transition-colors disabled:opacity-40">
          {loading ? "Đang tải..." : "↻ Làm mới"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Tổng đặt bàn", value: counts.total, color: "text-white" },
            { label: "Chờ xác nhận", value: counts.pending, color: "text-yellow-400" },
            { label: "Đã xác nhận",  value: counts.confirmed, color: "text-green-400" },
            { label: "Đã huỷ",       value: counts.cancelled, color: "text-red-400" },
          ].map(s => (
            <div key={s.label} className="border border-white/8 bg-navy/30 px-5 py-4">
              <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">{s.label}</p>
              <p className={`font-serif text-3xl font-light ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {reservations.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-20">Chưa có đặt bàn nào</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {["#", "Tên khách", "SĐT", "Ngày", "Giờ", "Khách", "Ghi chú", "Trạng thái", "Thao tác"].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-[9px] tracking-widest uppercase text-white/30 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-4 px-3 text-white/30 text-xs">{r.id}</td>
                    <td className="py-4 px-3">
                      <p className="text-white font-light">{r.name}</p>
                      <p className="text-white/30 text-xs">{r.email}</p>
                    </td>
                    <td className="py-4 px-3 text-white/60 text-xs">{r.phone}</td>
                    <td className="py-4 px-3 text-white/70 text-xs whitespace-nowrap">{r.date}</td>
                    <td className="py-4 px-3 text-white/70 text-xs">{String(r.time).slice(0, 5)}</td>
                    <td className="py-4 px-3 text-white/70 text-xs text-center">{r.guests}</td>
                    <td className="py-4 px-3 text-white/40 text-xs max-w-[160px] truncate">{r.notes || "—"}</td>
                    <td className="py-4 px-3">
                      <span className={`text-[9px] tracking-widest uppercase px-2 py-1 border ${STATUS_STYLES[r.status] || STATUS_STYLES.pending}`}>
                        {STATUS_LABELS[r.status] || r.status}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex gap-2">
                        {r.status !== "confirmed" && (
                          <button
                            onClick={() => updateStatus(r.id, "confirmed")}
                            disabled={updating === r.id}
                            className="text-[9px] tracking-widest uppercase px-2 py-1 border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-40"
                          >
                            Xác nhận
                          </button>
                        )}
                        {r.status !== "cancelled" && (
                          <button
                            onClick={() => updateStatus(r.id, "cancelled")}
                            disabled={updating === r.id}
                            className="text-[9px] tracking-widest uppercase px-2 py-1 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                          >
                            Huỷ
                          </button>
                        )}
                        {r.status !== "pending" && (
                          <button
                            onClick={() => updateStatus(r.id, "pending")}
                            disabled={updating === r.id}
                            className="text-[9px] tracking-widest uppercase px-2 py-1 border border-white/10 text-white/30 hover:text-white/60 transition-colors disabled:opacity-40"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
