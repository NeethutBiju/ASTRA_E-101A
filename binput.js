// 🔥 Firebase imports
import { auth, db } from "./firebase.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


/* =========================
   📄 DOM CONTENT LOADED
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("businessForm");
  const resultBox = document.getElementById("grokInsights");

  // 🔐 Ensure user is logged in
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }

    /* =========================
       📝 FORM SUBMIT
    ========================= */
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        // 📥 Collect form data
        const businessData = {
          businessName: document.getElementById("businessName").value.trim(),
          businessType: document.getElementById("businessType").value,
          otherBusinessType: document.getElementById("otherBusinessType")?.value || "",
          language: document.getElementById("language").value,
          mode: document.querySelector("input[name='mode']:checked").value, // online/offline
          availableTime: document.getElementById("availableTime").value,
          createdAt: serverTimestamp()
        };

        // 💾 Save to Firestore
        await setDoc(
          doc(db, "businessProfiles", user.uid),
          businessData
        );

        // ⏳ UI feedback
        resultBox.innerHTML = "🔍 Analyzing your business with AI...";
        resultBox.classList.remove("hidden");

        // 🤖 Send to Grok AI
        const analysis = await analyzeBusiness(businessData);

        // 📊 Show AI result
        resultBox.innerHTML = `
          <h3 class="font-bold text-lg mb-2">📈 AI Growth Insights</h3>
          <pre class="whitespace-pre-wrap text-sm">${JSON.stringify(analysis, null, 2)}</pre>
        `;

        // 🔁 Optional redirect
        // setTimeout(() => {
        //   window.location.href = "dashboard.html";
        // }, 3000);

      } catch (error) {
        console.error(error);
        resultBox.innerHTML = "❌ Failed to analyze business. Try again.";
      }
    });
  });
});
