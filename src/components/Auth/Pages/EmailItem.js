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

import "./EmailItem.css";
import ComposeMail from "../screen/ComposeMail";

const EmailItem = () => {
  const [emails, setEmails] = useState([]);
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/all")
      .then((response) => setEmails(response.data))
      .catch((error) => console.error("Error fetching emails:", error));
  }, []);
  const handleCompose = () => {
    setShowCompose(true);
  };

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
        <ListGroup variant="flush" className="sidebar-list ">
          <ListGroup.Item action>
            <Inbox size={16} /> Inbox
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

      <div className="flex-grow-1 inbox-panel">
        <Card className="shadow-sm">
          <ListGroup variant="flush">
            {emails.length > 0 ? (
              emails.map((email) => (
                <ListGroup.Item
                  key={email.id}
                  className="email-item d-flex justify-content-between align-items-center"
                >
                  <div className="email-info">
                    <input type="checkbox" className="me-2" />
                    <Star size={16} className="me-2 star-icon" />
                    <strong className="sender">{email.senderEmail}</strong>
                    <span className="subject"> – {email.subject}</span>
                    <span className="message-preview">{email.message}</span>
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
      </div>

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
