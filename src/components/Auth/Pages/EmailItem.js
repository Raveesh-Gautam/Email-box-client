// src/components/EmailItem.jsx
import {
  AlertCircle,
  Archive,
  FileText,
  Inbox,
  Send,
  Star,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import useEmails from "../../hooks/useEmails";
import ComposeMail from "../screen/ComposeMail";
import "./EmailItem.css";

const EmailItem = () => {
  const {
    emails,
    loading,
    unreadCount,
    deleteEmail,
    markAsSeen,
  } = useEmails();

  const [showCompose, setShowCompose] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  if (loading) return <p className="text-center mt-5">Loading emails...</p>;

  return (
    <div className="gmail-container d-flex">
      {/* Sidebar */}
      <div className="sidebar">
        <Button
          variant="primary"
          className="compose-btn w-75 m-3"
          onClick={() => setShowCompose(true)}
        >
          Compose
        </Button>
        <ListGroup variant="flush" className="sidebar-list">
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <Inbox size={16} /> Inbox
            </div>
            <span className="badge bg-primary rounded-pill">
              Unread {unreadCount}
            </span>
          </ListGroup.Item>

          <ListGroup.Item><Star size={16} /> Starred</ListGroup.Item>
          <ListGroup.Item><Send size={16} /> Sent</ListGroup.Item>
          <ListGroup.Item><FileText size={16} /> Drafts</ListGroup.Item>
          <ListGroup.Item><Archive size={16} /> Archive</ListGroup.Item>
          <ListGroup.Item><AlertCircle size={16} /> Spam</ListGroup.Item>
          <ListGroup.Item><Trash size={16} /> Trash</ListGroup.Item>
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
                      markAsSeen(email.id);
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
                        className="btn btn-dark delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEmail(email.id);
                        }}
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
          <Card className="shadow-sm p-4">
            <Button
              variant="link"
              className="mb-3 text-decoration-none"
              onClick={() => setSelectedEmail(null)}
            >
              ← Back to Inbox
            </Button>
            <h3 className="fw-semibold mb-3">{selectedEmail.subject}</h3>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <p><strong>From:</strong> {selectedEmail.senderEmail}</p>
                <p><strong>To:</strong> {selectedEmail.recievers.join(", ")}</p>
              </div>
              <span className="text-muted">
                {selectedEmail.dayLabel} • {selectedEmail.createdTime}
              </span>
            </div>
            <hr />
            <div className="mt-3" style={{ whiteSpace: "pre-line" }}>
              {selectedEmail.message}
            </div>
            <div className="mt-4 d-flex gap-2">
              <Button variant="outline-primary" size="sm">Reply</Button>
              <Button variant="outline-secondary" size="sm">Forward</Button>
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
