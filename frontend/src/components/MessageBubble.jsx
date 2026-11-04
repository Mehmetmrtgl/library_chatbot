import React from "react";
import "./MessageBubble.css";
import { API_BASE_URL } from "../config";

// Dosya yolundan sadece dosya ismini (orn: yonetmelik.pdf) ayıran yardımcı fonksiyon
const getFileName = (path) => {
  if (!path) return "";
  return path.split(/[\\/]/).pop();
};

function MessageBubble({ message }) {
  const bubbleClass = message.sender === "user" ? "user-bubble" : "bot-bubble";

  const handleFeedback = async (liked) => {
    try {
      await fetch(`${API_BASE_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.text,
          feedback: liked ? "like" : "dislike",
        }),
      });
    } catch (error) {
      console.error("Feedback gönderilemedi:", error);
    }
  };

  return (
    <div className={`message-bubble ${bubbleClass}`}>
      {/* Mesaj Metni */}
      <p className="message-text">{message.text}</p>

      {/* --- PDF KAYNAK ALANI (Sadece Bot ve Kaynak Varsa Görünür) --- */}
      {message.sender === "bot" && message.resource && message.resource.type === "pdf" && (
        <div className="pdf-resource-card">
          <div className="pdf-icon">📄</div>
          <div className="pdf-details">
            <span className="pdf-name">{getFileName(message.resource.name)}</span>
            {message.resource.page && (
              <span className="pdf-page">Sayfa: {message.resource.page}</span>
            )}
          </div>
          <a
            href={`${API_BASE_URL}/download/${getFileName(message.resource.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-download-btn"
          >
            İndir
          </a>
        </div>
      )}

      {/* Feedback Butonları */}
      {message.sender === "bot" && (
        <div className="feedback-buttons">
          <button onClick={() => handleFeedback(true)} title="Faydalı">👍</button>
          <button onClick={() => handleFeedback(false)} title="Faydasız">👎</button>
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
