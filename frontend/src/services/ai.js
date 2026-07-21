import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true
});

export const askAI = async (question) => {
    const { data } = await api.post("/admin/ai/chat", {
        question
    });

    return data;
};