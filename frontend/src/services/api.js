import axios from "axios";

const runtimeHost =
  typeof window !== "undefined" ? window.location.hostname : "localhost";
const runtimeProtocol =
  typeof window !== "undefined" ? window.location.protocol : "http:";
const defaultApiUrl = `${runtimeProtocol}//${runtimeHost}:5000/api`;
const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

const api = axios.create({
  baseURL: API_URL,
});

export const questionService = {
  getQuestions: () => api.get("/questions"),
  createQuestion: (text, sessionId) =>
    api.post("/questions", { text, sessionId }),
  getQuestion: (id) => api.get(`/questions/${id}`),
  updateStatus: (id, status) =>
    api.patch(`/questions/${id}/status`, { status }),
};

export const answerService = {
  getAnswers: (questionId) => api.get(`/answers/${questionId}`),
  addAnswer: (data) => api.post("/answers", data),
  react: (answerId, reaction) =>
    api.post(`/answers/${answerId}/react`, { reaction }),
};
export const sessionService = {
  init: (data) => api.post("/sessions/init", data),
  getStats: (sessionId) => api.get(`/sessions/${sessionId}/stats`),
};
