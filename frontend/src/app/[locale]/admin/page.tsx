"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-dc32.up.railway.app";

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
  seat_preference?: string;
  confirmation_sent?: boolean;
}

interface MenuItem {
  id: number;
  name_vi: string;
  name_en: string;
  description_vi: string | null;
  description_en: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
}

interface MenuForm {
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
  price: string;
  category: string;
  image_url: string;
  is_available: boolean;
}

interface CustomerProfile {
  email: string;
  name: string;
  phone: string;
  visits: number;
  totalGuests: number;
  lastVisit: string;
  confirmedCount: number;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  completed: "bg-white/10 text-white/40 border-white/15",
};

const STATUS_LABELS: Record<string, string> = {
  pending:   "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã huỷ",
  completed: "Hoàn thành",
};

const SEAT_LABELS: Record<string, string> = {
  window:   "Cửa sổ",
  private:  "P. riêng",
  terrace:  "Sân thượng",
  standard: "Chính",
};

const CATEGORIES = [
  { value: "starter",  label: "Khai vị" },
  { value: "main",     label: "Món chính" },
  { value: "dessert",  label: "Tráng miệng" },
  { value: "drink",    label: "Đồ uống" },
  { value: "combo",    label: "Set menu" },
];

const EMPTY_FORM: MenuForm = {
  name_vi: "", name_en: "",
  description_vi: "", description_en: "",
  price: "", category: "main",
  image_url: "", is_available: true,
};

const TIME_SLOTS = [
  "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
];

export default function AdminPage() {
  const [authed, setAuthed]     = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [pw, setPw]             = useState("");
  const [pwError, setPwError]   = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<"reservations" | "timeline" | "menu" | "customers">("reservations");

  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingRes, setLoadingRes]     = useState(false);
  const [updating, setUpdating]         = useState<number | null>(null);

  // Menu
  const [menuItems, setMenuItems]     = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm]       = useState<MenuForm>(EMPTY_FORM);
  const [savingMenu, setSavingMenu]   = useState(false);
  const [deletingId, setDeletingId]   = useState<number | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoadingRes(true);
    try {
      const res = await fetch(`${API_URL}/admin/reservations`, {
        headers: { "X-Admin-Key": adminKey },
      });
      if (res.ok) setReservations(await res.json());
    } finally {
      setLoadingRes(false);
    }
  }, [adminKey]);

  const fetchMenu = useCallback(async () => {
    setLoadingMenu(true);
    try {
      const res = await fetch(`${API_URL}/menu`);
      if (res.ok) setMenuItems(await res.json());
    } finally {
      setLoadingMenu(false);
    }
  }, []);

  useEffect(() => {
    if (authed) { fetchReservations(); fetchMenu(); }
  }, [authed, fetchReservations, fetchMenu]);

  const login = async () => {
    if (!pw) { setPwError(true); return; }
    setLoggingIn(true);
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { "X-Admin-Key": pw },
      });
      if (res.ok) {
        setAdminKey(pw);
        setAuthed(true);
        setPwError(false);
      } else {
        setPwError(true);
      }
    } catch {
      setPwError(true);
    } finally {
      setLoggingIn(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`${API_URL}/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-Admin-Key": adminKey },
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

  const openAddForm = () => {
    setEditingItem(null);
    setMenuForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setMenuForm({
      name_vi: item.name_vi,
      name_en: item.name_en,
      description_vi: item.description_vi || "",
      description_en: item.description_en || "",
      price: String(item.price),
      category: item.category,
      image_url: item.image_url || "",
      is_available: item.is_available,
    });
    setShowForm(true);
  };

  const saveMenuItem = async () => {
    if (!menuForm.name_vi || !menuForm.price) return;
    setSavingMenu(true);
    try {
      const body = {
        ...menuForm,
        price: parseFloat(menuForm.price),
        description_vi: menuForm.description_vi || null,
        description_en: menuForm.description_en || null,
        image_url: menuForm.image_url || null,
      };
      const url    = editingItem ? `${API_URL}/admin/menu/${editingItem.id}` : `${API_URL}/admin/menu`;
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "X-Admin-Key": adminKey },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        await fetchMenu();
        setShowForm(false);
        setEditingItem(null);
        setMenuForm(EMPTY_FORM);
      }
    } finally {
      setSavingMenu(false);
    }
  };

  const deleteMenuItem = async (id: number) => {
    if (!confirm("Xoá món ăn này?")) return;
    setDeletingId(id);
    try {
      await fetch(`${API_URL}/admin/menu/${id}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": adminKey },
      });
      setMenuItems(prev => prev.filter(i => i.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const toggleMenuItem = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/admin/menu/${id}/toggle`, {
        method: "PATCH",
        headers: { "X-Admin-Key": adminKey },
      });
      if (res.ok) {
        const updated = await res.json();
        setMenuItems(prev => prev.map(i => i.id === id ? updated : i));
      }
    } catch {}
  };

  const filteredReservations = filterStatus === "all"
    ? reservations
    : reservations.filter(r => r.status === filterStatus);

  const counts = {
    total:     reservations.length,
    pending:   reservations.filter(r => r.status === "pending").length,
    confirmed: reservations.filter(r => r.status === "confirmed").length,
    cancelled: reservations.filter(r => r.status === "cancelled").length,
  };

  // CRM: aggregate customer profiles from reservations
  const customers = useMemo<CustomerProfile[]>(() => {
    const map = new Map<string, CustomerProfile>();
    reservations.forEach(r => {
      const existing = map.get(r.email);
      if (!existing) {
        map.set(r.email, {
          email: r.email,
          name: r.name,
          phone: r.phone,
          visits: 1,
          totalGuests: r.guests,
          lastVisit: r.date,
          confirmedCount: r.status === "confirmed" || r.status === "completed" ? 1 : 0,
        });
      } else {
        existing.visits++;
        existing.totalGuests += r.guests;
        if (r.date > existing.lastVisit) existing.lastVisit = r.date;
        if (r.status === "confirmed" || r.status === "completed") existing.confirmedCount++;
      }
    });
    return Array.from(map.values()).sort((a, b) => b.visits - a.visits);
  }, [reservations]);

  // Timeline: 7 days ahead
  const next7Days = useMemo(() => {
    const days: string[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  }, []);

  // Timeline: count bookings by date+time slot
  const bookingMap = useMemo(() => {
    const map = new Map<string, number>();
    reservations.forEach(r => {
      if (r.status === "cancelled") return;
      const key = `${r.date}|${String(r.time).slice(0, 5)}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [reservations]);

  const todayStr = new Date().toISOString().split("T")[0];

  function formatDayLabel(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00");
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const wd = weekdays[d.getDay()];
    return `${day}/${month} ${wd}`;
  }

  function getCellStyle(count: number): string {
    if (count === 0) return "text-white/20";
    if (count <= 4) return "bg-green-500/10 text-green-400";
    if (count <= 8) return "bg-yellow-500/10 text-yellow-400";
    if (count <= 11) return "bg-orange-500/10 text-orange-400";
    return "bg-red-500/15 text-red-400";
  }

  function getTierBadge(visits: number): { label: string; style: string } {
    if (visits >= 5) return { label: "VIP", style: "bg-[#D4AF6A]/20 text-[#D4AF6A] border border-[#D4AF6A]/40" };
    if (visits >= 2) return { label: "Quen thuộc", style: "bg-white/10 text-white/60 border border-white/15" };
    return { label: "Mới", style: "bg-white/5 text-white/30 border border-white/10" };
  }

  // ── Login ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#091629] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="text-[9px] tracking-[0.25em] uppercase text-[#D4AF6A] text-center mb-2">Admin</p>
          <h1 className="font-serif text-3xl text-white font-light text-center mb-8">La Passion</h1>
          <div className="border border-white/10 p-8">
            <label className="text-[9px] tracking-[0.25em] uppercase text-white/40 block mb-3">Mật khẩu</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              placeholder="••••••••"
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors mb-2"
              autoFocus
            />
            {pwError && <p className="text-red-400 text-[10px] mb-4">Mật khẩu không đúng</p>}
            <button
              onClick={login}
              disabled={loggingIn}
              className="w-full mt-4 px-6 py-3 border border-[#D4AF6A]/40 text-[#D4AF6A] text-[10px] tracking-[0.2em] uppercase hover:bg-[#D4AF6A]/10 transition-colors disabled:opacity-40"
            >
              {loggingIn ? "Đang xác thực..." : "Đăng nhập"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">

      {/* Header */}
      <div className="bg-[#091629] border-b border-[#D4AF6A]/10 px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-[9px] tracking-[0.25em] uppercase text-[#D4AF6A]/60">Admin Dashboard</p>
          <h1 className="font-serif text-2xl font-light text-white mt-0.5">La Passion</h1>
        </div>
        <button
          onClick={() => { fetchReservations(); fetchMenu(); }}
          disabled={loadingRes || loadingMenu}
          className="text-white/40 hover:text-[#D4AF6A] text-xs tracking-widest uppercase transition-colors disabled:opacity-40"
        >
          {(loadingRes || loadingMenu) ? "Đang tải..." : "↻ Làm mới"}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-[#091629] border-b border-white/8 px-6">
        <div className="flex max-w-7xl mx-auto overflow-x-auto">
          {([
            { key: "reservations", label: "Đặt bàn",   badge: counts.pending > 0 ? counts.pending : null },
            { key: "timeline",     label: "Sơ đồ bàn", badge: null },
            { key: "customers",    label: "Khách hàng", badge: customers.length > 0 ? customers.length : null },
            { key: "menu",         label: "Thực đơn",  badge: menuItems.length > 0 ? menuItems.length : null },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 text-[10px] tracking-[0.2em] uppercase border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[#D4AF6A] text-[#D4AF6A]"
                  : "border-transparent text-white/30 hover:text-white/60"
              }`}
            >
              {tab.label}
              {tab.badge !== null && (
                <span className={`text-[8px] px-1.5 py-0.5 ${
                  activeTab === tab.key ? "bg-[#D4AF6A]/20 text-[#D4AF6A]" : "bg-white/10 text-white/40"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── RESERVATIONS TAB ── */}
        {activeTab === "reservations" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Tổng đặt bàn", value: counts.total,     color: "text-white" },
                { label: "Chờ xác nhận", value: counts.pending,   color: "text-yellow-400" },
                { label: "Đã xác nhận",  value: counts.confirmed, color: "text-green-400" },
                { label: "Đã huỷ",       value: counts.cancelled, color: "text-red-400" },
              ].map(s => (
                <div key={s.label} className="border border-white/8 bg-[#0D1F3C]/30 px-5 py-4">
                  <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">{s.label}</p>
                  <p className={`font-serif text-3xl font-light ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Status filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { key: "all",       label: "Tất cả" },
                { key: "pending",   label: "Chờ xác nhận" },
                { key: "confirmed", label: "Đã xác nhận" },
                { key: "cancelled", label: "Đã huỷ" },
                { key: "completed", label: "Hoàn thành" },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterStatus(f.key)}
                  className={`text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                    filterStatus === f.key
                      ? "border-[#D4AF6A]/60 text-[#D4AF6A] bg-[#D4AF6A]/10"
                      : "border-white/10 text-white/30 hover:text-white/60"
                  }`}
                >
                  {f.label}
                  {f.key !== "all" && (
                    <span className="ml-1.5 opacity-60">
                      {reservations.filter(r => r.status === f.key).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Table */}
            {filteredReservations.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-20">
                {filterStatus === "all" ? "Chưa có đặt bàn nào" : "Không có đặt bàn trong mục này"}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      {["#", "Tên khách", "SĐT", "Ngày", "Giờ", "Khách", "Vị trí", "Ghi chú", "Trạng thái", "Thao tác"].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-[9px] tracking-widest uppercase text-white/30 font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map(r => (
                      <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-3 text-white/30 text-xs">{r.id}</td>
                        <td className="py-4 px-3">
                          <p className="text-white font-light">{r.name}</p>
                          <p className="text-white/30 text-xs">{r.email}</p>
                        </td>
                        <td className="py-4 px-3 text-white/60 text-xs">{r.phone}</td>
                        <td className="py-4 px-3 text-white/70 text-xs whitespace-nowrap">{r.date}</td>
                        <td className="py-4 px-3 text-white/70 text-xs">{String(r.time).slice(0, 5)}</td>
                        <td className="py-4 px-3 text-white/70 text-xs text-center">{r.guests}</td>
                        <td className="py-4 px-3 text-white/40 text-xs">
                          {r.seat_preference ? (SEAT_LABELS[r.seat_preference] || r.seat_preference) : "—"}
                        </td>
                        <td className="py-4 px-3 text-white/40 text-xs max-w-[160px] truncate">{r.notes || "—"}</td>
                        <td className="py-4 px-3">
                          <span className={`text-[9px] tracking-widest uppercase px-2 py-1 border ${STATUS_STYLES[r.status] || STATUS_STYLES.pending}`}>
                            {STATUS_LABELS[r.status] || r.status}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex gap-2 flex-wrap">
                            {r.status !== "confirmed" && (
                              <button onClick={() => updateStatus(r.id, "confirmed")} disabled={updating === r.id}
                                className="text-[9px] tracking-widest uppercase px-2 py-1 border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-40">
                                Xác nhận
                              </button>
                            )}
                            {r.status === "confirmed" && (
                              <button onClick={() => updateStatus(r.id, "completed")} disabled={updating === r.id}
                                className="text-[9px] tracking-widest uppercase px-2 py-1 border border-white/15 text-white/40 hover:text-white/70 transition-colors disabled:opacity-40">
                                Hoàn thành
                              </button>
                            )}
                            {r.status !== "cancelled" && r.status !== "completed" && (
                              <button onClick={() => updateStatus(r.id, "cancelled")} disabled={updating === r.id}
                                className="text-[9px] tracking-widest uppercase px-2 py-1 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40">
                                Huỷ
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
          </>
        )}

        {/* ── TIMELINE TAB ── */}
        {activeTab === "timeline" && (
          <>
            <div className="mb-8">
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#D4AF6A]/60 mb-1">Sơ đồ bàn</p>
              <h2 className="font-serif text-2xl font-light">Phân bổ theo giờ — 7 ngày tới</h2>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
              {[
                { label: "Trống", style: "text-white/20" },
                { label: "1–4",   style: "bg-green-500/10 text-green-400" },
                { label: "5–8",   style: "bg-yellow-500/10 text-yellow-400" },
                { label: "9–11",  style: "bg-orange-500/10 text-orange-400" },
                { label: "Full",  style: "bg-red-500/15 text-red-400" },
              ].map(l => (
                <span key={l.label} className={`text-[9px] tracking-widest uppercase px-2 py-1 border border-white/5 ${l.style}`}>
                  {l.label}
                </span>
              ))}
              <span className="text-[9px] tracking-widest uppercase text-white/30 px-2 py-1">
                (mỗi ô = số bàn / tối đa 12)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 text-[9px] tracking-widest uppercase text-white/30 font-normal min-w-[80px]">Ngày</th>
                    {/* Lunch group header */}
                    <th colSpan={6} className="text-center py-2 px-3 text-[9px] tracking-widest uppercase text-[#D4AF6A]/60 font-normal border-b border-[#D4AF6A]/10">
                      Trưa
                    </th>
                    {/* Dinner group header */}
                    <th colSpan={8} className="text-center py-2 px-3 text-[9px] tracking-widest uppercase text-[#D4AF6A]/60 font-normal border-b border-[#D4AF6A]/10">
                      Tối
                    </th>
                  </tr>
                  <tr className="border-b border-white/8">
                    <th className="text-left py-2 px-3 text-[9px] tracking-widest uppercase text-white/20 font-normal"></th>
                    {TIME_SLOTS.map(slot => (
                      <th key={slot} className="py-2 px-1 text-[9px] text-white/30 font-normal min-w-[60px] text-center">
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {next7Days.map(dateStr => {
                    const isToday = dateStr === todayStr;
                    return (
                      <tr
                        key={dateStr}
                        className={`border-b border-white/5 ${isToday ? "border-l-2 border-l-[#D4AF6A]/60" : ""}`}
                      >
                        <td className={`py-3 px-3 whitespace-nowrap font-light ${isToday ? "text-[#D4AF6A] text-xs" : "text-white/50 text-xs"}`}>
                          {formatDayLabel(dateStr)}
                        </td>
                        {TIME_SLOTS.map(slot => {
                          const count = bookingMap.get(`${dateStr}|${slot}`) || 0;
                          const cellStyle = getCellStyle(count);
                          return (
                            <td key={slot} className="py-1 px-1 text-center">
                              <span className={`inline-block w-full min-w-[52px] py-1.5 text-[10px] font-light ${cellStyle}`}>
                                {count === 0 ? "—" : `${count}/12`}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── CUSTOMERS TAB ── */}
        {activeTab === "customers" && (
          <>
            <div className="mb-8">
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#D4AF6A]/60 mb-1">CRM</p>
              <h2 className="font-serif text-2xl font-light">{customers.length} khách hàng</h2>
            </div>

            {reservations.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-20">
                Chưa có dữ liệu đặt bàn
              </p>
            ) : customers.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-20">
                Chưa có khách hàng nào
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      {["Khách hàng", "Lần ghé", "Tổng khách", "Lần cuối", "Tier"].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-[9px] tracking-widest uppercase text-white/30 font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => {
                      const tier = getTierBadge(c.visits);
                      return (
                        <tr key={c.email} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-3">
                            <p className="text-white font-light">{c.name}</p>
                            <p className="text-white/30 text-xs">{c.email}</p>
                            <p className="text-white/20 text-xs">{c.phone}</p>
                          </td>
                          <td className="py-4 px-3">
                            <p className="text-white/70 text-sm font-light">{c.visits}</p>
                            {c.confirmedCount > 0 && (
                              <p className="text-green-400/60 text-[10px]">{c.confirmedCount} đã xác nhận</p>
                            )}
                          </td>
                          <td className="py-4 px-3 text-white/60 text-sm">{c.totalGuests}</td>
                          <td className="py-4 px-3 text-white/50 text-xs whitespace-nowrap">{c.lastVisit}</td>
                          <td className="py-4 px-3">
                            <span className={`text-[9px] tracking-widest uppercase px-2 py-1 ${tier.style}`}>
                              {tier.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── MENU TAB ── */}
        {activeTab === "menu" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase text-[#D4AF6A]/60 mb-1">Thực đơn</p>
                <h2 className="font-serif text-2xl font-light">{menuItems.length} món ăn</h2>
              </div>
              <button
                onClick={openAddForm}
                className="px-5 py-2.5 border border-[#D4AF6A]/40 text-[#D4AF6A] text-[10px] tracking-[0.2em] uppercase hover:bg-[#D4AF6A]/10 transition-colors"
              >
                + Thêm món
              </button>
            </div>

            {loadingMenu ? (
              <p className="text-white/30 text-sm text-center py-20">Đang tải...</p>
            ) : menuItems.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-20">Chưa có món ăn nào</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map(item => (
                  <div
                    key={item.id}
                    className={`border bg-[#0D1F3C]/20 p-4 transition-opacity ${
                      item.is_available ? "border-white/8" : "border-white/4 opacity-50"
                    }`}
                  >
                    {item.image_url && (
                      <div className="aspect-video bg-white/5 mb-3 overflow-hidden">
                        <img src={item.image_url} alt={item.name_vi} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <p className="text-white font-light truncate">{item.name_vi}</p>
                        <p className="text-white/40 text-xs truncate">{item.name_en}</p>
                      </div>
                      <span className="text-[8px] tracking-widest uppercase text-white/30 bg-white/5 px-2 py-0.5 whitespace-nowrap shrink-0">
                        {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                      </span>
                    </div>
                    {item.description_vi && (
                      <p className="text-white/40 text-xs mt-1 mb-3 line-clamp-2">{item.description_vi}</p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                      <p className="text-[#D4AF6A] font-light text-sm">
                        {Number(item.price).toLocaleString("vi-VN")}₫
                      </p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => toggleMenuItem(item.id)}
                          className={`text-[8px] tracking-widest uppercase px-2 py-1 border transition-colors ${
                            item.is_available
                              ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                              : "border-white/10 text-white/30 hover:text-white/60"
                          }`}
                        >
                          {item.is_available ? "Hiện" : "Ẩn"}
                        </button>
                        <button
                          onClick={() => openEditForm(item)}
                          className="text-[8px] tracking-widest uppercase px-2 py-1 border border-white/10 text-white/40 hover:text-white/70 hover:border-white/25 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteMenuItem(item.id)}
                          disabled={deletingId === item.id}
                          className="text-[8px] tracking-widest uppercase px-2 py-1 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── MENU FORM MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1F3C] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <h2 className="font-serif text-xl font-light">
                {editingItem ? "Sửa món ăn" : "Thêm món mới"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white text-lg transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-white/40 block mb-2">Tên (Tiếng Việt) *</label>
                  <input
                    value={menuForm.name_vi}
                    onChange={e => setMenuForm(f => ({ ...f, name_vi: e.target.value }))}
                    className="w-full bg-transparent border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                    placeholder="Bò Wagyu áp chảo"
                  />
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-white/40 block mb-2">Tên (English)</label>
                  <input
                    value={menuForm.name_en}
                    onChange={e => setMenuForm(f => ({ ...f, name_en: e.target.value }))}
                    className="w-full bg-transparent border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                    placeholder="Pan-seared Wagyu"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] tracking-widest uppercase text-white/40 block mb-2">Mô tả (Tiếng Việt)</label>
                <textarea
                  value={menuForm.description_vi}
                  onChange={e => setMenuForm(f => ({ ...f, description_vi: e.target.value }))}
                  rows={2}
                  className="w-full bg-transparent border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors resize-none"
                  placeholder="Mô tả hấp dẫn về món ăn..."
                />
              </div>

              <div>
                <label className="text-[9px] tracking-widest uppercase text-white/40 block mb-2">Mô tả (English)</label>
                <textarea
                  value={menuForm.description_en}
                  onChange={e => setMenuForm(f => ({ ...f, description_en: e.target.value }))}
                  rows={2}
                  className="w-full bg-transparent border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors resize-none"
                  placeholder="Appetizing description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-white/40 block mb-2">Giá (VND) *</label>
                  <input
                    type="number"
                    value={menuForm.price}
                    onChange={e => setMenuForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full bg-transparent border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                    placeholder="350000"
                  />
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-white/40 block mb-2">Danh mục</label>
                  <select
                    value={menuForm.category}
                    onChange={e => setMenuForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-[#0D1F3C] border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] tracking-widest uppercase text-white/40 block mb-2">URL ảnh</label>
                <input
                  value={menuForm.image_url}
                  onChange={e => setMenuForm(f => ({ ...f, image_url: e.target.value }))}
                  className="w-full bg-transparent border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMenuForm(f => ({ ...f, is_available: !f.is_available }))}
                  className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${menuForm.is_available ? "bg-[#D4AF6A]" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${menuForm.is_available ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <span className="text-[10px] tracking-widest uppercase text-white/40">
                  {menuForm.is_available ? "Đang phục vụ" : "Tạm ẩn"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-white/8">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2.5 border border-white/10 text-white/40 text-[10px] tracking-widest uppercase hover:text-white/70 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={saveMenuItem}
                disabled={savingMenu || !menuForm.name_vi || !menuForm.price}
                className="flex-1 px-4 py-2.5 border border-[#D4AF6A]/40 text-[#D4AF6A] text-[10px] tracking-widest uppercase hover:bg-[#D4AF6A]/10 transition-colors disabled:opacity-40"
              >
                {savingMenu ? "Đang lưu..." : editingItem ? "Cập nhật" : "Thêm món"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
