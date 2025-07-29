import { render, screen, fireEvent } from "@testing-library/react";
import SignUPForm from "./SignUPForm";
import axios from "axios";

jest.mock("axios"); // Mock axios to prevent API calls

describe("SignUPForm Component Tests", () => {
  test("renders heading correctly", () => {
    render(<SignUPForm />);
    const heading = screen.getByRole("heading", { name: /sign up/i });
    expect(heading).toBeInTheDocument();
  });

  test("email input should have type email", () => {
    render(<SignUPForm />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toHaveAttribute("type", "email");
  });

  test("password inputs should have type password", () => {
    render(<SignUPForm />);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm password/i);
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });

  test("shows error when passwords do not match", () => {
    render(<SignUPForm />);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "abcdef" } });

    const errorText = screen.getByText(/passwords do not match/i);
    expect(errorText).toBeInTheDocument();
  });

  test("successful form submission shows success message", async () => {
    axios.post.mockResolvedValue({ data: { idToken: "fakeToken" } });

    render(<SignUPForm />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    const successMsg = await screen.findByText(/signup successful/i);
    expect(successMsg).toBeInTheDocument();
  });
});
