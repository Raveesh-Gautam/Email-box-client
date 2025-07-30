import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from "axios";

const LoginForm = ({ onLoginStatus }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [emailValid, setEmailValid] = useState(null);
  const [apiError, setApiError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Client-side validation
    if (!validateEmail(form.email)) {
      setEmailValid(false);
      setApiError("❌ Invalid email format.");
      return;
    }
    if (form.password.length < 6) {
      setApiError("❌ Password must be at least 6 characters long.");
      return;
    }

    try {
      const LoginData = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDEQ4_XesfQI5fq4VFs-ls3TIASfe8bRwE`,
        {
          email: form.email,
          password: form.password,
          returnSecureToken: true,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Login Success:", LoginData.data);
      onLoginStatus(true);
      setForm({ email: "", password: "" });
      setApiError("Login Successful!");
    } catch (err) {
      console.log("Login error", err.response?.data);
      const errorMessage = err.response?.data?.error?.message;

      if (errorMessage === "EMAIL_NOT_FOUND") {
        setApiError("❌ Email not registered.");
      } else if (errorMessage === "INVALID_PASSWORD") {
        setApiError("❌ Incorrect password.");
      } else {
        setApiError("❌ Login failed. Please try again.");
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center ">
      <Card className="p-4 shadow-lg" style={{ width: "350px" }}>
        <Card.Body>
          <h3 className="text-center mb-4">Login</h3>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group as={Row} className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm({ ...form, email: value });
                  setEmailValid(validateEmail(value));
                  setApiError("");
                }}
                isValid={emailValid === true}
                isInvalid={emailValid === false}
                required
              />
              <Form.Text
                className={
                  emailValid === false ? "text-danger" : "text-success"
                }
              >
                {emailValid === false && "❌ Invalid email"}
                {emailValid === true && "✅ Looks good"}
              </Form.Text>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </Form.Group>

            {apiError && (
              <p
                className={`text-center ${
                  apiError.includes("✅") ? "text-success" : "text-danger"
                }`}
              >
                {apiError}
              </p>
            )}

            <div className="text-center">
              <Button
                className="w-100 border rounded-pill"
                variant="primary"
                type="submit"
              >
                Login
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginForm;
