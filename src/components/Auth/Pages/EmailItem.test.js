import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import EmailItem from "./EmailItem";

test("renders all sidebar menu items", () => {
  render(<EmailItem />);
  expect(screen.getByText(/Inbox/i)).toBeInTheDocument();
  expect(screen.getByText(/Starred/i)).toBeInTheDocument();
  expect(screen.getByText(/Sent/i)).toBeInTheDocument();
  expect(screen.getByText(/Drafts/i)).toBeInTheDocument();
  expect(screen.getByText(/Trash/i)).toBeInTheDocument();
});
test("shows no emails message when emails array is empty", () => {
  render(<EmailItem />);
  expect(screen.getByText(/No emails found/i)).toBeInTheDocument();
});

test("opens compose modal on button click", async () => {
  render(<EmailItem />);
  const button = screen.getByText(/Compose/i);
  await userEvent.click(button);
  expect(screen.getByText(/New Message/i)).toBeInTheDocument();
});
