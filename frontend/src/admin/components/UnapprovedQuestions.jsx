import React, { useEffect, useState } from "react";
import { getUnapprovedQuestions, approveAnswer, rejectAnswer, markForEdit } from "../utils/api";
import "../components/AdminStyles.css";


const UnapprovedQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    const data = await getUnapprovedQuestions();
    setQuestions(data || []);
    setLoading(false);
  };

  const handleApprove = async (questionId, answerText) => {
    if (!answerText.trim()) {
      alert("Cevap boş olamaz!");
      return;
    }
    const success = await approveAnswer(questionId, answerText);
    if (success) {
      alert("Cevap onaylandı.");
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } else {
      alert("Onaylama başarısız.");
    }
  };

  const handleReject = async (questionId) => {
    if (!window.confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;

    const success = await rejectAnswer(questionId);
    if (success) {
      alert("Soru reddedildi ve silindi.");
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } else {
      alert("Reddetme başarısız.");
    }
  };

  const handleSendToEdit = async (questionId, answerText) => {
    if (!answerText.trim()) {
      alert("Boş cevap düzenlenemez!");
      return;
    }
    const success = await markForEdit(questionId, answerText);
    if (success) {
      alert("Cevap düzenlemeye gönderildi.");
      fetchQuestions();
    } else {
      alert("Düzenleme için gönderilemedi.");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (questions.length === 0) return <p>Onaysız soru bulunamadı.</p>;

  return (
    <div>
      <h2>Onaysız Sorular</h2>
      {questions.map((q) => (
        <div key={q.id} className="question-box">
          <p><strong>Soru:</strong> {q.question}</p>
          <textarea
            placeholder="Yanıt girin..."
            value={q.answer || ""}
            onChange={(e) => {
              const updated = questions.map((item) =>
                item.id === q.id ? { ...item, answer: e.target.value } : item
              );
              setQuestions(updated);
            }}
            rows={4}
          />
          <div className="button-group">
            <button onClick={() => handleApprove(q.id, q.answer || "")}>✅ Onayla ve Kaydet</button>
            <button onClick={() => handleReject(q.id)}>❌ Reddet</button>
            <button onClick={() => handleSendToEdit(q.id, q.answer || "")}>📝 Düzenlemeye Gönder</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UnapprovedQuestions;
