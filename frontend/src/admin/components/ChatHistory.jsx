import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ChatHistory.css"; // stil için opsiyonel
import { API_BASE_URL } from "../../config";

const ChatHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [history, setHistory] = useState([]);

  // Oturum ID’lerini al
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/chat_sessions`)
      .then((res) => setSessions(res.data.sessions))
      .catch((err) => console.error("Oturumlar alınamadı:", err));
  }, []);

  // Seçili oturumun geçmişini al
  useEffect(() => {
    if (!selectedSession) return;

    axios
      .get(`${API_BASE_URL}/api/chat_history/${selectedSession}`)
      .then((res) => setHistory(res.data.history))
      .catch((err) => console.error("Geçmiş alınamadı:", err));
  }, [selectedSession]);

  return (
    <div className="chat-history">
      <h3>Konuşma Geçmişi</h3>
      <div className="session-selector">
        <label>Oturum Seçin:</label>
        <select onChange={(e) => setSelectedSession(e.target.value)} value={selectedSession}>
          <option value="">-- Seçin --</option>
          {sessions.map((session) => (
            <option key={session} value={session}>
              {session}
            </option>
          ))}
        </select>
      </div>

      <div className="history-list">
        {history.map((msg, idx) => (
          <div key={idx} className={`history-item ${msg.role}`}>
            <strong>{msg.role === "user" ? "👤 Kullanıcı" : "🤖 Bot"}:</strong>
            <p>{msg.message}</p>
            <span className="timestamp">{msg.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
