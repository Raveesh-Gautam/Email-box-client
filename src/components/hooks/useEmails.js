// src/hooks/useEmails.js
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const API_BASE = "http://localhost:8080";

export default function useEmails(pollingInterval = 2000) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const previousEmailIds = useRef(new Set());

  // Fetch Emails
  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem("firebaseToken");
      const response = await axios.get(`${API_BASE}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedEmails = response.data;
      const fetchedIds = new Set(fetchedEmails.map((e) => e.id));

      const hasNewMail =
        emails.length === 0 ||
        fetchedEmails.length !== emails.length ||
        [...fetchedIds].some((id) => !previousEmailIds.current.has(id));

      if (hasNewMail) {
        setEmails(fetchedEmails);
        setUnreadCount(fetchedEmails.filter((email) => !email.seen).length);
        previousEmailIds.current = fetchedIds;
      }

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // Delete Email
  const deleteEmail = async (id) => {
    const token = localStorage.getItem("firebaseToken");
    await axios.delete(`${API_BASE}/${id}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEmails((prev) => prev.filter((email) => email.id !== id));
  };

  // Mark as Seen
  const markAsSeen = async (id) => {
    const token = localStorage.getItem("firebaseToken");
    await axios.put(`${API_BASE}/${id}/seen`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, seen: true } : email
      )
    );
  };

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, pollingInterval);
    return () => clearInterval(interval);
  }, []);

  return { emails, loading, error, unreadCount, deleteEmail, markAsSeen };
}
