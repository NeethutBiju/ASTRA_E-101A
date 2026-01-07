// 🔥 Firebase imports
import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const emailError = emailInput.closest(".flex-col").querySelector("p");
  const passwordError = passwordInput.closest(".flex-col").querySelector("p");

  const successToast = document.getElementById("successToast");
  const form = document.querySelector("form");
  const togglePasswordBtn = passwordInput.parentElement.querySelector("button");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function resetErrors() {
    emailError.classList.add("hidden");
    passwordError.classList.add("hidden");
  }

  function showEmailError(message) {
    emailError.innerHTML = `<span class="material-symbols-outlined text-[14px]">error</span> ${message}`;
    emailError.classList.remove("hidden");
  }

  function showPasswordError(message) {
    passwordError.innerHTML = `<span class="material-symbols-outlined text-[14px]">error</span> ${message}`;
    passwordError.classList.remove("hidden");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resetErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email) return showEmailError("Email is required");
    if (!emailRegex.test(email)) return showEmailError("Please enter a valid email address");
    if (!password) return showPasswordError("Password is required");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔍 Check business profile
      const businessRef = doc(db, "businessProfiles", user.uid);
      const businessSnap = await getDoc(businessRef);

      // ✅ Show success toast
      successToast.classList.remove("hidden");
      successToast.classList.add("animate-bounce");

      setTimeout(() => {
        successToast.classList.add("hidden");
        successToast.classList.remove("animate-bounce");

        if (businessSnap.exists()) {
          window.location.href = "dashboard.html";
        } else {
          window.location.href = "business-form.html";
        }
      }, 1500);

    } catch (error) {
      console.error(error);
      if (error.code === "auth/user-not-found") showEmailError("Account not found");
      else if (error.code === "auth/wrong-password") showPasswordError("Incorrect password");
      else showPasswordError("Login failed. Try again.");
    }
  });

  // 👁 Password toggle
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
