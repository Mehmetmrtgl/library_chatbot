import React, { useState } from "react";
import axios from "axios";
import "./components/AdminStyles.css";

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5001/admin/login", {
        username,
        password,
      });

      if (res.data.status === "ok") {
        localStorage.setItem("admin_token", res.data.token);
        onLoginSuccess(); // ❗ yönlendirmeyi props ile yapıyoruz
      } else {
        alert("Giriş başarısız: Kullanıcı adı veya şifre hatalı.");
      }
    } catch (err) {
      console.error("Sunucu hatası:", err);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="admin-login">
      <header className="admin-login__header">
        <p className="eyebrow">Yönetici Erişimi</p>
        <h2>Kontrol Merkezine Giriş</h2>
        <p className="admin-login__subtitle">
          Onaylanan yöneticiler chatbot eğitim veri kümesini günceller, geri bildirimleri yönetir ve inceleme süreçlerini hızlandırır.
        </p>
      </header>

      <div className="admin-login__form">
        <label className="field">
          <span>Kurum e-postası</span>
          <input
            className="field-input"
            placeholder="ad.soyad@hacettepe.edu.tr"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Parola</span>
          <input
            className="field-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        
        <button type="button" onClick={handleLogin}>
          Paneli Aç
        </button>
      </div>

      <footer className="admin-login__footer">
        <p>Giriş sorunları için library@hacettepe.edu.tr adresiyle iletişime geçin.</p>
      </footer>
    </div>
  );
};

export default AdminLogin;
