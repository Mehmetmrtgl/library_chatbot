import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminStyles.css";

const AnswerEditor = () => {
  const [questions, setQuestions] = useState([]);
  const [editStates, setEditStates] = useState({});
  const [editedAnswer, setEditedAnswer] = useState({});  // 👈 eksik olan bu

  useEffect(() => {
    axios.get("http://localhost:5001/api/questions_with_answers")
      .then((res) => setQuestions(res.data.questions))
      .catch((err) => console.error("Sorular alınamadı:", err));
  }, []);

  const handleEdit = (id, field, value) => {
    setEditStates(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value }
    }));
  };

  const handleSave = (id) => {
    const updated = editStates[id];
    if (!updated) return;

    axios.post("http://localhost:5000/api/update_answer", {
      question_id: id,
      answer: updated.answer,
    })
    .then(() => alert("Cevap güncellendi!"))
    .catch(() => alert("Hata oluştu!"));
  };

  return (
    <div className="answer-editor">
      <h3>Cevap Düzenleyici</h3>
      {questions.map((q) => (
  <div key={q.id} className="editor-item">
    <div className="question">Soru: {q.question}</div>

    <textarea
      value={editStates[q.id]?.answer || q.answer}
      onChange={(e) => handleEdit(q.id, "answer", e.target.value)}
    />

    <div className="quality-score">
      Kalite Puanı (1–5):
      <input
        type="number"
        min="1"
        max="5"
        value={editedAnswer[`score-${q.id}`] || ""}
        onChange={(e) =>
          setEditedAnswer({
            ...editedAnswer,
            [`score-${q.id}`]: parseInt(e.target.value),
          })
        }
      />
      <button
        onClick={async () => {
          const score = editedAnswer[`score-${q.id}`];
          if (!score) return alert("Skor girilmedi");
          try {
            await axios.post("http://localhost:5001/api/set_quality_score", {
              question_id: q.id,
              score,
            });
            alert("Skor kaydedildi");
          } catch {
            alert("Skor kaydedilemedi");
          }
        }}
      >
        Skoru Kaydet
      </button>
    </div>

    <div className="edit-block">
      <button onClick={() => handleSave(q.id)}>💾 Cevabı Kaydet</button>
      <button
        onClick={async () => {
          try {
            const res = await axios.post("http://localhost:5001/api/generate_alternative", {
              question: q.question,
            });
            const altAnswer = res.data.alternative;
            setEditStates(prev => ({
              ...prev,
              [q.id]: { ...(prev[q.id] || {}), answer: altAnswer }
            }));
          } catch {
            alert("Alternatif cevap üretilemedi");
          }
        }}
      >
        🤖 Yeni Öneri Üret
      </button>
    </div>
  </div>
))}


    </div>
  );
};

export default AnswerEditor;
