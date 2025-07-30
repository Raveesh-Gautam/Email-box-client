import { screen, render, fireEvent } from "@testing-library/react";
import LoginForm from "./LoginForm";
import axios from "axios";
jest.mock("axios");
describe("Login Form checking", () => {
  test("Login heading should be present", () => {
    render(<LoginForm />);
    const heading = screen.getByRole("heading", { name: /Login/i });
    expect(heading).toBeInTheDocument();
  });
  test("email input should have type email", () => {
    render(<LoginForm />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toHaveAttribute("type", "email");
  });

  test("password input should have type password",()=>{
    render(<LoginForm />)
    const passwordInput=screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toBeInTheDocument();
  })
test('successful login', async () => {
  axios.post.mockResolvedValue({ data: { idToken: "fake" } });
  const mockOnLoginStatus = jest.fn(); 

  render(<LoginForm onLoginStatus={mockOnLoginStatus} />);

  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: 'abc@gmail.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: "123456" },
  });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  const successMsg = await screen.findByText(/login successful/i);
  expect(successMsg).toBeInTheDocument();

  expect(mockOnLoginStatus).toHaveBeenCalledWith(true);
});

});
