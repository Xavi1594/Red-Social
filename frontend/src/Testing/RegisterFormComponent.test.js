import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RegisterFormComponent from "../Components/RegisterFormComponent";

describe("RegisterFormComponent", () => {
  it("renders the registration form", () => {
    render(<RegisterFormComponent />);
  });

  it("allows the user to enter input and submit the form", () => {
    const { getByLabelText, getByText } = render(<RegisterFormComponent />);

    const nameInput = getByLabelText("Nombre de usuario");
    const emailInput = getByLabelText("E-Mail");
    const passwordInput = getByLabelText("Contraseña");
    const confirmPasswordInput = getByLabelText("Confirmar Contraseña");
    const countryInput = getByLabelText("País de residencia");
    const cityInput = getByLabelText("Ciudad de residencia");
    const ageInput = getByLabelText("Edad");
    const submitButton = getByText("Registrarse");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.change(countryInput, { target: { value: "USA" } });
    fireEvent.change(cityInput, { target: { value: "New York" } });
    fireEvent.change(ageInput, { target: { value: "25" } });
    fireEvent.click(submitButton);
  });

  it("displays an error message for invalid email", () => {
    const { getByLabelText, getByText } = render(<RegisterFormComponent />);

    const emailInput = getByLabelText("E-Mail");
    const submitButton = getByText("Registrarse");

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);
  });

  it("displays an error message for password mismatch", () => {
    const { getByLabelText, getByText } = render(<RegisterFormComponent />);

    const passwordInput = getByLabelText("Contraseña");
    const confirmPasswordInput = getByLabelText("Confirmar Contraseña");
    const submitButton = getByText("Registrarse");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "different-password" },
    });
    fireEvent.click(submitButton);
  });
});
