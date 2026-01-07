// 🔥 Firebase imports
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const fullNameInput = document.getElementById("fullname");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");

  const nameError = fullNameInput.closest(".flex-col").querySelector("p");
  const emailError = emailInput.closest(".flex-col").querySelector("p");
  const passwordError = passwordInput.closest(".flex-col").querySelector("p");
  const confirmPasswordError = confirmPasswordInput.closest(".flex-col").querySelector("p");

  const successToast = document.querySelector(".bg-green-500");
  const toggleButtons = document.querySelectorAll("button[type='button']");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function resetErrors() {
    nameError.classList.add("hidden");
    emailError.classList.add("hidden");
    passwordError.classList.add("hidden");
    confirmPasswordError.classList.add("hidden");
  }

  function showError(element, message) {
    element.innerHTML = `
      <span class="material-symbols-outlined text-[14px]">error</span>
      ${message}
    `;
    element.classList.remove("hidden");
  }

  // 🔐 REGISTER USER (Firebase)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resetErrors();

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // UI validation (UNCHANGED)
    if (!fullName) {
      showError(nameError, "This field is required");
      return;
    }

    if (!email) {
      showError(emailError, "This field is required");
      return;
    }

    if (!emailRegex.test(email)) {
      showError(emailError, "Please enter a valid email address");
      return;
    }

    if (!password) {
      showError(passwordError, "This field is required");
      return;
    }

    if (password.length < 8) {
      showError(passwordError, "Password must be at least 8 characters");
      return;
    }

    if (!confirmPassword) {
      showError(confirmPasswordError, "This field is required");
      return;
    }

    if (password !== confirmPassword) {
      showError(confirmPasswordError, "Passwords do not match");
      return;
    }

    try {
      // 🔥 Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 🔥 Store extra user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        createdAt: new Date()
      });

      // ✅ Success UI
      successToast.classList.remove("hidden");

      setTimeout(() => {
        successToast.classList.add("hidden");
        window.location.href = "login.html";
      }, 1500);

    } catch (error) {
      // 🔴 Firebase error → UI messages
      if (error.code === "auth/email-already-in-use") {
        showError(emailError, "An account with this email already exists");
      } else if (error.code === "auth/weak-password") {
        showError(passwordError, "Password is too weak");
      } else {
        showError(emailError, "Registration failed. Try again.");
      }
    }
  });

  // 👁 Password visibility toggle
  toggleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      const icon = btn.querySelector("span");

      if (input.type === "password") {
        input.type = "text";
        icon.textContent = "visibility_off";
      } else {
        input.type = "password";
        icon.textContent = "visibility";
      }
    });
  });
});
