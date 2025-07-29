import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

function SignUPForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailValid, setEmailValid] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [apiError, setApiError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValid(validateEmail(value));
    setApiError("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordMatch(value === confirmPassword);
    setApiError("");
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!emailValid || !passwordMatch) {
      setApiError("❌ Please fix the errors before submitting.");
      return;
    }
    if(password.length<6) {
        alert('password should be 6 character long.')
        return;
    }

    try {
      const SignUpData = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDEQ4_XesfQI5fq4VFs-ls3TIASfe8bRwE`,
        {
          email,
          password,
          returnSecureToken: true,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Signup Success:", SignUpData.data);

      // Clear inputs
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setEmailValid(null);
      setPasswordMatch(null);
      setApiError("✅ Signup Successful!");
    } catch (err) {
      console.error("Signup Error:", err.response?.data);

      const errorMessage = err.response?.data?.error?.message;
      if (errorMessage === "EMAIL_EXISTS") {
        setApiError("❌ This email is already registered.");
      } else if (
        errorMessage ===
        "WEAK_PASSWORD : Password should be at least 6 characters"
      ) {
        setApiError("❌ Password must be at least 6 characters.");
      } else if (errorMessage === "INVALID_EMAIL") {
        setApiError("❌ Invalid email format.");
      } else {
        setApiError(errorMessage || "❌ Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="bg-success">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-4 shadow-lg" style={{ width: "350px" }}>
          <Card.Body>
            <h3 className="text-center mb-4">Sign Up</h3>
            <Form onSubmit={handleSubmit}>
              {/* Email */}
              <Form.Group className="mb-2">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
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

              {/* Password */}
              <Form.Group className="mb-2">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  isValid={passwordMatch === true}
                  isInvalid={passwordMatch === false}
                  required
                />
                <Form.Text
                  className={
                    passwordMatch === false ? "text-danger" : "text-success"
                  }
                >
                  {passwordMatch === false && "❌ Passwords do not match"}
                  {passwordMatch === true && "✅ Passwords match"}
                </Form.Text>
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

              <div className="text-center mt-3">
                <Button
                  className="w-100 border rounded-pill"
                  variant="primary"
                  type="submit"
                >
                  Sign Up
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default SignUPForm;
