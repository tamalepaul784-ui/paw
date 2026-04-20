const districtsByRegion = {
  Western: ["Mbarara", "Ibanda", "Fort Portal", "Hoima", "Kabale"],
  Northern: ["Gulu", "Lira", "Arua", "Kitgum", "Nebbi"]
};

const adviceData = {
  Mbarara: {
    maize: "Rainfall conditions are favorable. Prepare land and plant maize after two effective rain events. Maintain spacing of 75 cm by 30 cm and scout for fall armyworm early.",
    coffee: "Mbarara is suitable for coffee. Plant at the onset of rainy conditions, mulch well, and maintain early disease monitoring.",
    banana: "Banana can do well with mulching and manure application. Ensure clean planting material and good drainage.",
    beans: "Beans can be planted once rains are steady. Use well-drained soils and monitor for foliar disease.",
    tomato: "Tomato needs careful disease monitoring and proper spacing. Avoid waterlogging and begin with healthy seedlings."
  },
  Gulu: {
    maize: "Prepare land now, but wait for sustained rainfall before planting maize. Use improved seed and watch for fall armyworm after the first rains.",
    beans: "Beans are suitable after rainfall is established. Avoid false starts and ensure good seed quality.",
    tomato: "Tomato can perform well with good field management and moisture control. Monitor pests and diseases closely.",
    coffee: "Coffee is less common here than in Western Uganda, so start with a small trial and confirm local suitability.",
    banana: "Banana requires good moisture management. Consider mulching heavily and choose suitable planting sites."
  }
};

const fallbackAdvice = {
  maize: "Plant maize after confirming effective rains. Use recommended spacing and start early pest scouting.",
  beans: "Plant beans when rains are reliable and maintain disease monitoring.",
  banana: "Plant banana at the start of the rainy season and use manure plus mulch for establishment.",
  coffee: "Coffee should be planted at rainfall onset with good field hygiene and disease monitoring.",
  tomato: "Tomato requires careful spacing, healthy seedlings, and strong pest and disease management."
};

const regionEl = document.getElementById("region");
const districtEl = document.getElementById("district");
const cropEl = document.getElementById("crop");
const farmerTypeEl = document.getElementById("farmerType");
const resultEl = document.getElementById("result");
const smsBoxEl = document.getElementById("smsBox");
const generateBtn = document.getElementById("generateBtn");

function populateDistricts() {
  const region = regionEl.value;
  districtEl.innerHTML = "";
  districtsByRegion[region].forEach((district) => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    districtEl.appendChild(option);
  });
}

function generateAdvice() {
  const district = districtEl.value;
  const crop = cropEl.value;
  const farmerType = farmerTypeEl.value;

  const districtAdvice = adviceData[district]?.[crop] || fallbackAdvice[crop];
  const extra = farmerType === "commercial"
    ? " As a commercial farmer, keep records for planting date, inputs, and crop health monitoring."
    : " As a smallholder farmer, prioritize timely planting, quality seed, and regular field checks.";

  resultEl.innerHTML = `
    <strong>District:</strong> ${district}<br>
    <strong>Crop:</strong> ${crop.charAt(0).toUpperCase() + crop.slice(1)}<br><br>
    ${districtAdvice}${extra}
  `;

  smsBoxEl.textContent = `YO AGRONOMIST: ${district} ${crop} advice: ${districtAdvice.split(".")[0]}.`;
}

regionEl.addEventListener("change", populateDistricts);
generateBtn.addEventListener("click", generateAdvice);

populateDistricts();
