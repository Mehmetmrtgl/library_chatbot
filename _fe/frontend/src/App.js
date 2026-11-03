import React, { useMemo, useState } from "react";
import ChatWidget from "./components/ChatWidget";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import "./App.css";

export default function App() {
  const [view, setView] = useState("chat");
  const isAdmin = Boolean(localStorage.getItem("admin_token"));

  const navigation = useMemo(() => {
    return [
      { id: "chat", label: "Chatbot" },
      { id: "admin", label: isAdmin ? "Admin Oturumu" : "Admin Girişi" },
    ];
  }, [isAdmin]);

  const renderView = () => {
    if (view === "chat") {
      return <ChatWidget />;
    }

    if (view === "admin") {
      return <AdminLogin onLoginSuccess={() => setView("dashboard")} />;
    }

    if (!isAdmin) {
      return (
        <div className="empty-state">
          <h3>Yetki doğrulaması gerekli</h3>
          <p>Bu paneli görmek için önce admin girişi yapmalısınız.</p>
          <button type="button" onClick={() => setView("admin")}>
            Giriş ekranına dön
          </button>
        </div>
      );
    }

    return <AdminDashboard />;
  };

  return (
    <div className="app-shell">
      <div className="ambient-glow" aria-hidden />
      <header className="app-hero">
        <div className="brand-block">
          <div className="brand-mark">HU</div>
          <div>
            <p className="eyebrow">Hacettepe Üniversitesi</p>
            <h1>Akıllı Kütüphane Asistanı</h1>
            <p className="subtitle">
              Üniversite kütüphanemizin dijital dönüşüm yolculuğunda yeni bir sayfa açıyoruz. Öğrencilerimize 7/24 hizmet veren akıllı chatbot asistanı.
            </p>
          </div>
        </div>

        <nav className="primary-nav" aria-label="Ana gezinme">
          {navigation.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={view === id ? "active" : ""}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </nav>

      </header>

      <main className="app-main">
        <section className={`panel-card ${view === "admin" ? "panel-card--admin" : ""}`}>
          <div className={`panel-body large-panel ${view === "admin" ? "panel-body--admin" : ""}`}>
            {renderView()}
          </div>
        </section>

      </main>
    </div>
  );
}
