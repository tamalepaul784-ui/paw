const districtOptions = {
  Western: ["Mbarara", "Ibanda", "Kabale", "Fort Portal", "Hoima"],
  Northern: ["Gulu", "Lira", "Arua", "Kitgum", "Nebbi"]
};

const weatherDatabase = {
  Mbarara: { rainfall: "18 mm expected", condition: "Favorable rains", temp: "22–28°C", note: "Good planting window likely after consistent showers." },
  Ibanda: { rainfall: "20 mm expected", condition: "Steady showers", temp: "21–27°C", note: "Cereals and vegetables can be prepared for planting." },
  Kabale: { rainfall: "26 mm expected", condition: "Cool and wet", temp: "16–23°C", note: "High disease vigilance is needed for vegetables." },
  Fort Portal: { rainfall: "24 mm expected", condition: "Reliable moisture", temp: "20–26°C", note: "Favorable for banana and coffee management." },
  Hoima: { rainfall: "9 mm expected", condition: "Scattered rain", temp: "23–31°C", note: "Wait for stronger rainfall confirmation before planting broadly." },
  Gulu: { rainfall: "11 mm expected", condition: "Onset building", temp: "24–33°C", note: "Prepare land and confirm effective rains first." },
  Lira: { rainfall: "16 mm expected", condition: "Favorable", temp: "23–32°C", note: "Good window opening for maize and beans." },
  Arua: { rainfall: "15 mm expected", condition: "Regular pattern", temp: "22–30°C", note: "Suitable for cereals and vegetables." },
  Kitgum: { rainfall: "5 mm expected", condition: "Dry spell risk", temp: "24–34°C", note: "Delay planting or use drought-tolerant seed." },
  Nebbi: { rainfall: "17 mm expected", condition: "Rain strengthening", temp: "23–31°C", note: "Good planting window opening for cereals." }
};

const cropGuidance = {
  maize: {
    planting: "Plant after two effective rain events.",
    spacing: "Use about 75 cm x 30 cm spacing.",
    pests: "Scout early for fall armyworm.",
    nutrition: "Apply manure or balanced fertilizer guided by soil status."
  },
  beans: {
    planting: "Plant once soil moisture is stable.",
    spacing: "Use line planting for better field management.",
    pests: "Watch for bean stem maggot and foliar disease.",
    nutrition: "Use manure and phosphorus where needed."
  },
  banana: {
    planting: "Best planted at onset of the rainy season.",
    spacing: "Allow enough spacing for airflow and root expansion.",
    pests: "Monitor for weevils and bacterial wilt.",
    nutrition: "Mulch heavily and add organic manure around mats."
  },
  coffee: {
    planting: "Plant at rainy season onset with strong field preparation.",
    spacing: "Use recommended spacing based on coffee type and shade system.",
    pests: "Monitor for leaf rust and coffee berry disease.",
    nutrition: "Build soil organic matter and feed based on soil analysis."
  },
  tomato: {
    planting: "Transplant when weather is stable and drainage is good.",
    spacing: "Keep spacing wide enough to reduce disease pressure.",
    pests: "Watch for blight, Tuta absoluta, and bacterial wilt.",
    nutrition: "Use decomposed manure and split nutrient application."
  }
};

const regionEl = document.getElementById("region");
const districtEl = document.getElementById("district");
const cropEl = document.getElementById("crop");
const farmerTypeEl = document.getElementById("farmerType");
const weatherOutput = document.getElementById("weatherOutput");
const adviceOutput = document.getElementById("adviceOutput");
const generateBtn = document.getElementById("generateBtn");
const scrollBtn = document.getElementById("scrollBtn");
const demoForm = document.getElementById("demoForm");
const demoResponse = document.getElementById("demoResponse");

const authModal = document.getElementById("authModal");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const closeModal = document.getElementById("closeModal");
const authForm = document.getElementById("authForm");
const authName = document.getElementById("authName");
const authNameLabel = document.getElementById("authNameLabel");
const modalTitle = document.getElementById("modalTitle");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authMessage = document.getElementById("authMessage");
const heroDemoBtn = document.getElementById("heroDemoBtn");

let authMode = "login";

function populateDistricts() {
  const region = regionEl.value;
  districtEl.innerHTML = districtOptions[region]
    .map((district) => `<option value="${district}">${district}</option>`)
    .join("");
}

function generateAdvice() {
  const district = districtEl.value;
  const crop = cropEl.value;
  const farmerType = farmerTypeEl.value;
  const weather = weatherDatabase[district];
  const cropData = cropGuidance[crop];

  weatherOutput.innerHTML = `
    <strong>${district}</strong><br>
    Condition: ${weather.condition}<br>
    Rainfall: ${weather.rainfall}<br>
    Temperature: ${weather.temp}<br>
    Note: ${weather.note}
  `;

  adviceOutput.innerHTML = `
    <strong>${crop.charAt(0).toUpperCase() + crop.slice(1)} advisory for ${farmerType.toLowerCase()} farmer</strong><br>
    Planting: ${cropData.planting}<br>
    Spacing: ${cropData.spacing}<br>
    Nutrition: ${cropData.nutrition}<br>
    Pest watch: ${cropData.pests}<br>
    Weather fit: ${weather.note}
  `;

  weatherOutput.classList.remove("muted");
  adviceOutput.classList.remove("muted");
}

function openAuthModal(mode) {
  authMode = mode;
  authModal.classList.remove("hidden");
  authMessage.classList.add("hidden");
  authForm.reset();

  if (mode === "signup") {
    modalTitle.textContent = "Sign Up";
    authSubmitBtn.textContent = "Create Account";
    authName.classList.remove("hidden");
    authNameLabel.classList.remove("hidden");
    authName.required = true;
  } else {
    modalTitle.textContent = "Log In";
    authSubmitBtn.textContent = "Log In";
    authName.classList.add("hidden");
    authNameLabel.classList.add("hidden");
    authName.required = false;
  }
}

function closeAuthModal() {
  authModal.classList.add("hidden");
}

regionEl.addEventListener("change", populateDistricts);
generateBtn.addEventListener("click", generateAdvice);
scrollBtn.addEventListener("click", () => {
  document.getElementById("advisorySection").scrollIntoView({ behavior: "smooth" });
});
heroDemoBtn.addEventListener("click", () => {
  demoForm.scrollIntoView({ behavior: "smooth" });
  document.getElementById("demoName").focus();
});

loginBtn.addEventListener("click", () => openAuthModal("login"));
signupBtn.addEventListener("click", () => openAuthModal("signup"));
closeModal.addEventListener("click", closeAuthModal);
authModal.addEventListener("click", (e) => {
  if (e.target === authModal) closeAuthModal();
});

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  authMessage.classList.remove("hidden");
  if (authMode === "signup") {
    authMessage.textContent = `Demo sign up successful for ${authName.value || "user"}. In a full version, this would create a real account.`;
  } else {
    authMessage.textContent = `Demo login successful for ${document.getElementById("authEmail").value}. In a full version, this would authenticate the user.`;
  }
});

demoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("demoName").value;
  const interest = document.getElementById("demoInterest").value;
  demoResponse.classList.remove("hidden");
  demoResponse.textContent = `Thanks ${name}. Your ${interest.toLowerCase()} request has been captured for this demo version.`;
  demoForm.reset();
});

populateDistricts();
generateAdvice();
