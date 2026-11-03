import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminStyles.css";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4caf50", "#f44336", "#2196f3", "#ff9800"];

const AnalyticsPanel = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/stats");
        setStats(res.data);
      } catch (err) {
        console.error("İstatistikler alınamadı:", err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Yükleniyor...</p>;

  const daily = Number(stats.daily_messages) || 0;
  const weekly = Number(stats.weekly_messages) || 0;

  const barChartData = [
    { label: "Günlük", value: daily },
    { label: "Haftalık", value: weekly },
  ];

  const pieData = [
    { name: "Beğeni", value: stats.total_likes || 0 },
    { name: "Beğenmeme", value: stats.total_dislikes || 0 },
  ];

  const answerTypeData = Array.isArray(stats.answer_type_distribution)
    ? stats.answer_type_distribution.map((item) => ({
        type: item.type,
        count: item.count,
      }))
    : [];

  const lineData = Array.isArray(stats.last_7_days)
    ? stats.last_7_days.map((item) => ({
        date: item.date,
        count: item.count,
      }))
    : [];

  return (
    <div className="analytics-panel">
      <h3>📊 İstatistik Paneli</h3>

      <div className="analytics-boxes">
        <div className="box">📅 Günlük Mesaj: <strong>{daily}</strong></div>
        <div className="box">📆 Haftalık Mesaj: <strong>{weekly}</strong></div>
        <div className="box">❗ Onay Bekleyen: <strong>{stats.unapproved_count}</strong></div>
        <div className="box">👍 Beğeni: <strong>{stats.total_likes}</strong></div>
        <div className="box">👎 Beğenmeme: <strong>{stats.total_dislikes}</strong></div>
        <div className="box">👥 Kişi Başına Mesaj: <strong>{stats.average_messages_per_user || 0}</strong></div>
      </div>

      <div className="chart-grid">
        <div className="chart-container">
          <h4>📊 Günlük vs Haftalık Mesaj</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>📈 Son 7 Günlük Mesaj Trendleri</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2196f3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>👍👎 Geri Bildirim Oranı</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>🧠 Cevap Türleri Dağılımı</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={answerTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="top-answers">
        <h4>🔥 En Çok Beğenilen Cevaplar</h4>
        <ol>
          {Array.isArray(stats.top_answers) &&
            stats.top_answers.map((item, idx) => (
              <li key={idx}>
                {item.answer}{" "}
                <span style={{ color: "#4caf50" }}>({item.likes} 👍)</span>
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
