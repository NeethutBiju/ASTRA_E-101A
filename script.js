/* -------- Vendor Login -------- */
function vendorLogin() {
  const vendor = document.getElementById("vendorName").value;
  localStorage.setItem("currentVendor", vendor);
  window.location.href = "dashboard.html";
}

function goInvestorLogin() {
  window.location.href = "investorlogin.html";
}

/* -------- Investor Login -------- */
function investorLogin() {
  window.location.href = "investordashboard.html";
}

/* -------- Submit Pitch -------- */
function submitPitch(e) {
  e.preventDefault();

  const pitch = {
    vendor: localStorage.getItem("currentVendor"),
    idea: idea.value,
    investment: investment.value,
    profit: profit.value,
    description: description.value,
    status: "Pending"
  };

  let pitches = JSON.parse(localStorage.getItem("pitches")) || [];
  pitches.push(pitch);
  localStorage.setItem("pitches", JSON.stringify(pitches));

  alert("Idea submitted successfully!");
  location.reload();
}

/* -------- Load Vendor Pitches -------- */
if (document.getElementById("vendorPitches")) {
  const vendor = localStorage.getItem("currentVendor");
  const pitches = JSON.parse(localStorage.getItem("pitches")) || [];

  pitches
    .filter(p => p.vendor === vendor)
    .forEach(p => {
      vendorPitches.innerHTML += `
        <div class="card">
          <h4>${p.idea}</h4>
          <p>Status: <b>${p.status}</b></p>
        </div>
      `;
    });
}

/* -------- Load Investor Pitches -------- */
if (document.getElementById("investorPitches")) {
  const pitches = JSON.parse(localStorage.getItem("pitches")) || [];

  if (pitches.length === 0) {
    investorPitches.innerHTML = "<p>No pitches available</p>";
  }

  pitches.forEach((p, i) => {
    investorPitches.innerHTML += `
      <div class="card">
        <h3>${p.idea}</h3>
        <p><b>Vendor:</b> ${p.vendor}</p>
        <p><b>Investment:</b> ₹${p.investment}</p>
        <p><b>Profit:</b> ${p.profit}</p>
        <p>${p.description}</p>
        <p>Status: <b>${p.status}</b></p>
        <button onclick="updateStatus(${i}, 'Accepted')">Accept</button>
        <button class="danger" onclick="updateStatus(${i}, 'Rejected')">Reject</button>
      </div>
    `;
  });
}

/* -------- Accept / Reject -------- */
function updateStatus(index, status) {
  let pitches = JSON.parse(localStorage.getItem("pitches"));
  pitches[index].status = status;
  localStorage.setItem("pitches", JSON.stringify(pitches));
  location.reload();
}