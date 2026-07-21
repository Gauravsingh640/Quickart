import axios from "axios";

const api = axios.create({
    baseURL: "https://quickart-jxc5.onrender.com/api",
    withCredentials: true
});

export const askAI = async (question) => {
    const { data } = await api.post("/admin/ai/chat", {
        question
    });

    return data;
};