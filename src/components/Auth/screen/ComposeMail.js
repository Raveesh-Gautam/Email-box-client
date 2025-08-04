import { EditorState } from "draft-js";
import { MailIcon, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import useSendEmail from "../../hooks/useSendEmail";
import "./ComposeMail.css";

const ComposeMail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const { sendEmail } = useSendEmail();

  const handleSend = async () => {
    if (!to || !subject || !editorState.getCurrentContent().hasText()) {
      alert("All fields are required!");
      return;
    }

    const receiversArray = to.split(",").map((email) => email.trim());
    const messageContent = editorState.getCurrentContent().getPlainText();

    const emailData = {
      subject,
      message: messageContent,
      senderEmail: "gautamraveesh07@gmail.com",
      recievers: receiversArray,
    };

    try {
      await sendEmail(emailData);
      alert("✅ Mail sent successfully!");
      setTo("");
      setSubject("");
      setEditorState(EditorState.createEmpty());
    } catch (err) {
      console.error("Error sending mail:", err);
      alert("❌ Failed to send mail.");
    }
  };

  return (
    <Container className="d-flex mt-1">
      <Card className="p-4" style={{ width: "770px" }}>
        <Form>
          {/* Recipient */}
          <div className="compose-input mb-3">
            <MailIcon className="compose-icon" />
            <Form.Control
              type="email"
              placeholder="Recipient's email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="compose-input-field"
              required
            />
          </div>

          {/* Subject */}
          <div className="compose-input mb-3">
            <MessageCircle className="compose-icon" />
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="compose-input-field"
              required
            />
          </div>

          {/* Message Editor */}
          <div className="compose-message mb-3">
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              toolbarClassName="compose-toolbar"
              wrapperClassName="compose-wrapper"
              editorClassName="compose-editor"
              placeholder="Write your message..."
            />
          </div>

          <Button variant="primary" className="w-100" onClick={handleSend}>
            Send Mail
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ComposeMail;
