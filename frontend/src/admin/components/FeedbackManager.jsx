import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminStyles.css"; // Stil varsa buraya

const FeedbackManager = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/feedback_logs");
         console.log(res.data);
        setFeedbacks(res.data.feedback || []);
      } catch (error) {
        console.error("Geri bildirimler alınamadı:", error);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="admin-panel">
      <h3>Geri Bildirim Kayıtları</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Soru</th>
            <th>Cevap</th>
            <th>Beğeni</th>
            <th>Tarih</th>
            <th>Session ID</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb, index) => (
            <tr key={index}>
              <td>{fb.question_text}</td>
              <td>{fb.answer_text}</td>
              <td>{fb.feedbackType ? "👍" : "👎"}</td>
              <td>{new Date(fb.timestamp).toLocaleString()}</td>
              <td>{fb.session_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackManager;
