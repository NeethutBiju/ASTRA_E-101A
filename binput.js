// business.js
import { auth, db, storage } from "./firebase.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const form = document.getElementById("businessForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("Please login first");
    return;
  }

  const formData = new FormData(form);

  const businessMode = formData.get("business_mode");
  let imageURL = null;

  // 🔹 Upload image only if OFFLINE
  if (businessMode === "offline") {
    const imageFile = document.getElementById("storeImageInput").files[0];

    if (imageFile) {
      const imageRef = ref(
        storage,
        `storeImages/${user.uid}/${imageFile.name}`
      );
      await uploadBytes(imageRef, imageFile);
      imageURL = await getDownloadURL(imageRef);
    }
  }

  const businessProfile = {
    uid: user.uid,
    businessName: formData.get("businessName"),
    businessType:
      formData.get("businessType") === "other"
        ? formData.get("otherType")
        : formData.get("businessType"),
    language: formData.get("language"),
    budget: Number(formData.get("budget")),
    teamSize: Number(formData.get("teamSize")),
    availableTime: Number(formData.get("availableTime")),
    growthGoal: formData.get("growthGoal"),
    businessMode,
    storeImage: imageURL,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, "businessProfiles", user.uid), businessProfile);

  document.getElementById("successToast").classList.remove("hidden");
  document.getElementById("successToast").classList.add("flex");

  form.reset();
});
