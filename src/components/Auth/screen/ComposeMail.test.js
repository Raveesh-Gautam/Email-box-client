import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ComposeMail from "./ComposeMail";

jest.mock("axios");

// Mock editor to a simple textarea
jest.mock("react-draft-wysiwyg", () => ({
  Editor: (props) => (
    <textarea
      aria-label="Message"
      value={props.editorState.getCurrentContent().getPlainText()}
      onChange={(e) => {
        props.onEditorStateChange({
          getCurrentContent: () => ({
            hasText: () => !!e.target.value,
            getPlainText: () => e.target.value,
          }),
        });
      }}
    />
  ),
}));

describe("ComposeMail Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test("renders all form fields and button", () => {
    render(<ComposeMail />);
    expect(screen.getByPlaceholderText("Recipient's email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter subject")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send mail/i })).toBeInTheDocument();
  });

  test("shows alert when required fields are empty", () => {
    render(<ComposeMail />);
    fireEvent.click(screen.getByRole("button", { name: /send mail/i }));
    expect(window.alert).toHaveBeenCalledWith("All fields are required!");
  });

  test("sends email successfully and clears inputs", async () => {
    axios.post.mockResolvedValueOnce({ data: "success" });

    render(<ComposeMail />);
    fireEvent.change(screen.getByPlaceholderText("Recipient's email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter subject"), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Hello message" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send mail/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("✅ Mail sent successfully!");
    });
  });

  test("handles failed email send", async () => {
    axios.post.mockRejectedValueOnce(new Error("Failed"));

    render(<ComposeMail />);
    fireEvent.change(screen.getByPlaceholderText("Recipient's email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter subject"), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Hello" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send mail/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("❌ Failed to send mail.");
    });
  });

  test("splits multiple recipients into array", async () => {
    axios.post.mockResolvedValueOnce({ data: "success" });

    render(<ComposeMail />);
    fireEvent.change(screen.getByPlaceholderText("Recipient's email"), {
      target: { value: "a@test.com, b@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter subject"), {
      target: { value: "Subject" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Message" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send mail/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/send",
        expect.objectContaining({
          recievers: ["a@test.com", "b@test.com"],
        })
      );
    });
  });
});
