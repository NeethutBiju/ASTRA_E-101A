// 🔥 Firebase imports
import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const emailError = emailInput.closest(".flex-col").querySelector("p");
  const passwordError = passwordInput.closest(".flex-col").querySelector("p");

  const successToast = document.querySelector(".bg-green-500");
  const form = document.querySelector("form");
  const togglePasswordBtn = passwordInput.parentElement.querySelector("button");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Reset errors
  function resetErrors() {
    emailError.classList.add("hidden");
    passwordError.classList.add("hidden");
  }

  function showEmailError(message) {
    emailError.innerHTML = `
      <span class="material-symbols-outlined text-[14px]">error</span>
      ${message}
    `;
    emailError.classList.remove("hidden");
  }

  function showPasswordError(message) {
    passwordError.innerHTML = `
      <span class="material-symbols-outlined text-[14px]">error</span>
      ${message}
    `;
    passwordError.classList.remove("hidden");
  }

  // 🔐 FORM SUBMIT → FIREBASE LOGIN
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resetErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // UI validations
    if (!email) {
      showEmailError("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      showEmailError("Please enter a valid email address");
      return;
    }

    if (!password) {
      showPasswordError("Password is required");
      return;
    }

    try {
      // 🔥 Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 🔍 CHECK BUSINESS PROFILE
      const businessRef = doc(db, "businessProfiles", user.uid);
      const businessSnap = await getDoc(businessRef);

      // ✅ Success UI
      successToast.classList.remove("hidden");

      setTimeout(() => {
        successToast.classList.add("hidden");

      }, 1500);

    } catch (error) {
      // 🔴 Firebase error handling → UI messages
      if (error.code === "auth/user-not-found") {
        showEmailError("Account not found");
      } else if (error.code === "auth/wrong-password") {
        showPasswordError("Incorrect password");
      } else if (error.code === "auth/invalid-credential") {
        showPasswordError("Invalid email or password");
      } else {
        showPasswordError("Login failed. Try again.");
      }
    }
  });

  // 👁 Password visibility toggle
  togglePasswordBtn.addEventListener("click", () => {
    const icon = togglePasswordBtn.querySelector("span");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.textContent = "visibility_off";
    } else {
      passwordInput.type = "password";
      icon.textContent = "visibility";
    }
  });
});
