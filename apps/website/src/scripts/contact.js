import { ZodError } from "zod";
import { contactSchema } from "../../../../shared/src/validation";
import config from "./config";
import { showToast } from "./toast";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("contact-form-submit");
  const spinner = submitBtn?.querySelector(".submit-spinner");
  const submitText = submitBtn?.querySelector(".submit-text");

  function clearErrors() {
    const inputs = form.querySelectorAll(".form-control");
    inputs.forEach((input) => {
      input.classList.remove("is-invalid");
      const feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = "";
      }
    });
  }

  function showError(fieldName, message) {
    const input = form.querySelector(`[name="${fieldName}"]`);
    const feedback = input?.nextElementSibling;
    if (input && feedback && feedback.classList.contains("invalid-feedback")) {
      input.classList.add("is-invalid");
      feedback.textContent = message;
    }
  }

  form?.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(form);

    const contact = {
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    try {
      contactSchema.parse(contact);
    } catch (err) {
      if (err instanceof ZodError) {
        err.errors.forEach((e) => {
          showError(e.path[0], e.message);
        });
        return;
      }
      throw err;
    }

    submitBtn.disabled = true;
    spinner?.style.setProperty("display", "inline-block");
    submitText?.style.setProperty("display", "none");

    try {
      const response = await fetch(`${config.apiUrl}/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        showError("message", "Something went wrong. Please try again.");
        showToast("Failed to send message. Please try again.", "error");
        return;
      }

      form.reset();
      clearErrors();
      showToast("Message sent successfully!", "success");
    } catch (err) {
      console.error("Error sending message:", err);
      showError("message", "Something went wrong. Please try again.");
      showToast("An unexpected error occurred. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      spinner?.style.setProperty("display", "none");
      submitText?.style.setProperty("display", "inline-block");
    }
  });
});
