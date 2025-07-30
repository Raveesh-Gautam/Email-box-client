import axios from "axios";
import { EditorState, convertToRaw } from "draft-js";
import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const ComposeMail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleSend = async () => {
    if (!to || !subject || !editorState.getCurrentContent().hasText()) {
      alert("All fields are required!");
      return;
    }

    // Convert editor content to raw JSON for storing
    const messageContent = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );

    const emailData = {
      to,
      subject,
      message: messageContent, 
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(
        `https://email-box-22a5b-default-rtdb.firebaseio.com/email.json`,
        emailData
      );

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
    <Container className="d-flex justify-content-center mt-5">
      <Card className="p-4 shadow-lg" style={{ width: "600px" }}>
        <h3 className="text-center mb-3">Compose Mail</h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>To</Form.Label>
            <Form.Control
              type="email"
              placeholder="Recipient's email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
            />
          </Form.Group>

          <Button variant="primary" className="w-100" onClick={handleSend}>
            Send Mail
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ComposeMail;
