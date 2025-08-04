import axios from "axios";
import {
  AlertCircle,
  Archive,
  FileText,
  Inbox,
  Send,
  Star,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ComposeMail from "../screen/ComposeMail";
import "./EmailItem.css";

const EmailItem = () => {
  const [emails, setEmails] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [seen, setSeen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem("firebaseToken");
    axios
      .get("http://localhost:8080/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setEmails(response.data);
        const count = response.data.filter((email) => !email.seen).length;
        setUnreadCount(count);
      })
      .catch((error) => console.error("Error fetching emails:", error));
  }, []);

  const handleCompose = () => {
    setShowCompose(true);
  };
  const handleEmailDelete = async (id) => {
    try {
      const token = localStorage.getItem("firebaseToken");
      const deleteResponse = await axios.delete(
        `http://localhost:8080/${id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(deleteResponse.data);

      setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
    } catch (err) {
      console.log("Delete failed:", err.message);
    }
  };

  console.log(emails);

  return (
    <div className="gmail-container d-flex">
      {/* Sidebar */}
      <div className="sidebar">
        <Button
          variant="primary"
          className="compose-btn w-75 m-3"
          onClick={handleCompose}
        >
          Compose
        </Button>
        <ListGroup variant="flush" className="sidebar-list">
          <ListGroup.Item
            action
            className="d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center gap-2">
              <Inbox size={16} /> Inbox
            </div>
            <span className="badge bg-primary rounded-pill">
              {" "}
              unread {unreadCount}
            </span>
          </ListGroup.Item>

          <ListGroup.Item action>
            <Star size={16} /> Starred
          </ListGroup.Item>
          <ListGroup.Item action>
            <Send size={16} /> Sent
          </ListGroup.Item>
          <ListGroup.Item action>
            <FileText size={16} /> Drafts
          </ListGroup.Item>
          <ListGroup.Item action>
            <Archive size={16} /> Archive
          </ListGroup.Item>
          <ListGroup.Item action>
            <AlertCircle size={16} /> Spam
          </ListGroup.Item>
          <ListGroup.Item action>
            <Trash size={16} /> Trash
          </ListGroup.Item>
        </ListGroup>
      </div>

      {/* Right panel */}
      <div className="flex-grow-1 inbox-panel">
        {!selectedEmail ? (
          <Card className="shadow-sm">
            <ListGroup variant="flush">
              {emails.length > 0 ? (
                emails.map((email) => (
                  <ListGroup.Item
                    key={email.id}
                    className="email-item d-flex justify-content-between align-items-center"
                    onClick={() => {
                      setSelectedEmail(email);
                      setEmails((prev) =>
                        prev.map((e) =>
                          e.id === email.id ? { ...e, seen: true } : e
                        )
                      );
                      const token = localStorage.getItem("firebaseToken");
                      axios
                        .put(`http://localhost:8080/${email.id}/seen`, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        })
                        .catch((err) =>
                          console.error("Error marking as seen:", err)
                        );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="email-info">
                      <input
                        type="checkbox"
                        className="me-2"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Star size={16} className="me-2 star-icon" />
                      {!email.seen && <span className="blue-dot me-2"></span>}
                      <strong className="sender">{email.senderEmail}</strong>
                      <span className="subject"> – {email.subject}</span>
                      <span className="message-preview">{email.message}</span>
                    </div>
                    <div className="position-relative email-item ">
                      <button
                        data-testid={`delete-btn-${email.id}`}
                        className="btn btn-dark delete-btn position-absolute top-50 start-50 translate-middle w-100"
                        onClick={() => handleEmailDelete(email.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>

                    <div className="email-meta">
                      <span className="time">
                        {email.dayLabel} • {email.createdTime}
                      </span>
                      <Badge bg="secondary" className="ms-2">
                        {email.recievers.length}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="no-emails">
                  No emails found.
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        ) : (
          /* Full Email View */
          <Card className="shadow-sm p-4">
            <Button
              variant="link"
              className="mb-3 text-decoration-none"
              onClick={() => setSelectedEmail(null)}
            >
              ← Back to Inbox
            </Button>

            {/* Subject */}
            <h3 className="fw-semibold mb-3">{selectedEmail.subject}</h3>

            {/* Sender and receivers */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <p className="mb-1">
                  <strong>From:</strong> {selectedEmail.senderEmail}
                </p>
                <p className="mb-1">
                  <strong>To:</strong> {selectedEmail.recievers.join(", ")}
                </p>
              </div>
              <span className="text-muted">
                {selectedEmail.dayLabel} • {selectedEmail.createdTime}
              </span>
            </div>

            {/* Divider */}
            <hr />

            {/* Message content */}
            <div
              className="mt-3"
              style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}
            >
              {selectedEmail.message}
            </div>

            {/* Action buttons (Reply, Forward) */}
            <div className="mt-4 d-flex gap-2">
              <Button variant="outline-primary" size="sm">
                Reply
              </Button>
              <Button variant="outline-secondary" size="sm">
                Forward
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Compose Modal */}
      <Modal
        show={showCompose}
        onHide={() => setShowCompose(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>New Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ComposeMail />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmailItem;
