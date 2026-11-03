// src/admin/utils/api.js
import { authHeaders } from "./auth";

// Backend adresini buraya sabitliyoruz
const API_BASE_URL = "http://localhost:5001";

export const getUnapprovedQuestions = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/unapproved_questions`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      console.error("❌ API hatası:", res.status);
      return [];
    }

    const data = await res.json();
    return data.questions || [];

  } catch (err) {
    console.error("❌ JSON parse hatası:", err);
    return [];
  }
};

export const approveAnswer = async (questionId, answerText) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/approve_answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ question_id: questionId, answer: answerText }),
    });
    return res.ok;
  } catch (error) {
    console.error("Onaylama hatası:", error);
    return false;
  }
};

export const rejectAnswer = async (questionId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/reject_answer/${questionId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return res.ok;
  } catch (error) {
    console.error("Reddetme hatası:", error);
    return false;
  }
};

export const markForEdit = async (questionId, answerText) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/mark_for_edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ question_id: questionId, answer: answerText }),
    });
    return res.ok;
  } catch (error) {
    console.error("Düzenleme hatası:", error);
    return false;
  }
};
