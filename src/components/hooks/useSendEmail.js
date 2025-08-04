import axios from "axios";

const API_BASE = "http://localhost:8080";

export default function useSendEmail() {
  const sendEmail = async (emailData) => {
    const token = localStorage.getItem("firebaseToken");
    await axios.post(`${API_BASE}/send`, emailData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return { sendEmail };
}
