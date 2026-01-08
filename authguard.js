import { auth } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const growthBtn = document.getElementById("growthPlanBtn");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // ❌ Not logged in
    growthBtn.addEventListener("click", () => {
      window.location.href = "veninv.html";
    });
  } else {
    // ✅ Logged in
    growthBtn.addEventListener("click", () => {
      window.location.href = "business-form.html";
    });
  }
});
