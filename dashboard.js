import { auth } from "./firebase.js";

document.getElementById("generatePlanBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("Not logged in");

  document.getElementById("aiResult").classList.remove("hidden");
  document.getElementById("aiResult").innerText = "🤖 AI is analyzing your business...";

  const res = await fetch(
    "https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/analyzeBusiness",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: user.uid })
    }
  );

  const data = await res.json();

  document.getElementById("aiResult").innerText = data.plan;
});
