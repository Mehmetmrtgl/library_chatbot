// src/admin/AdminDashboard.jsx
import React, { useState } from "react";
import UnapprovedQuestions from "./components/UnapprovedQuestions";
import ChatHistory from "./components/ChatHistory";
import FeedbackManager from "./components/FeedbackManager";
import AnalyticsPanel from "./components/AnalyticsPanel";
import AnswerEditor  from "./components/AnswerEditor";
import "./components/AdminStyles.css";
import axios from "axios";
const AdminDashboard = () => {
  const [view, setView] = useState("unapproved");

  const handleExport = async () => {
    try {
      const res = await axios.post("http://localhost:5001/api/export_finetune_data");
      alert(`Export tamamlandı. Yeni eklenen kayıt: ${res.data.exported}`);
    } catch (err) {
      alert("Export sırasında hata oluştu");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-toolbar">
        <div>
          <p className="eyebrow">Operasyon Merkezi</p>
          <h2>Admin Paneli</h2>
        </div>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => {
            localStorage.removeItem("admin_token");
            window.location.reload();
          }}
        >
          Çıkış Yap
        </button>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav__tabs">
          <button
            type="button"
            className={view === "unapproved" ? "active" : ""}
            onClick={() => setView("unapproved")}
          >
            Onaysız Sorular
          </button>
          <button type="button" className={view === "history" ? "active" : ""} onClick={() => setView("history")}>
            Konuşma Geçmişi
          </button>
          <button type="button" className={view === "feedback" ? "active" : ""} onClick={() => setView("feedback")}>
            Geri Bildirimler
          </button>
          <button type="button" className={view === "analytics" ? "active" : ""} onClick={() => setView("analytics")}>
            İstatistikler
          </button>
          <button type="button" className={view === "editor" ? "active" : ""} onClick={() => setView("editor")}>
            Cevap Düzenleyici
          </button>
        </div>

        <div className="admin-nav__actions">
          <button type="button" onClick={handleExport}>
            Fine-tuning verisini dışa aktar
          </button>
          <button type="button" onClick={() => window.open("http://localhost:5001/api/download_fine_tune_data")}>
            📤 Fine-tuning verisini indir
          </button>
        </div>
      </nav>

      {view === "unapproved" && <UnapprovedQuestions />}
      {view === "history" && <ChatHistory />}
      {view === "feedback" && <FeedbackManager />}
      {view === "analytics" && <AnalyticsPanel />}
      {view === "editor" && <AnswerEditor />}
    </div>
  );
};

export default AdminDashboard;
