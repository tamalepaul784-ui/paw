const districtsByRegion={Western:["Mbarara","Ibanda","Fort Portal","Hoima","Kabale"],Northern:["Gulu","Lira","Arua","Kitgum","Nebbi"]};
const weatherByDistrict={Mbarara:"Moderate rain expected; good maize and coffee window.",Ibanda:"Showers building; suitable for cereals and beans.","Fort Portal":"Wet conditions; good for banana and coffee, manage disease risk.",Hoima:"Scattered rainfall; avoid false starts.",Kabale:"Cool and wet; vegetables need disease monitoring.",Gulu:"Rains approaching; prepare land and plant after effective rains.",Lira:"Good onset signal; maize and beans favorable.",Arua:"Regular rains; good for cereals and vegetables.",Kitgum:"Dry spell risk; delay broad planting.",Nebbi:"Rain strengthening; cereals favorable."};
const regionSelect=document.getElementById('regionSelect');
const districtSelect=document.getElementById('districtSelect');
const cropSelect=document.getElementById('cropSelect');
const farmerTypeSelect=document.getElementById('farmerTypeSelect');
const weatherBox=document.getElementById('weatherBox');
const resultBox=document.getElementById('resultBox');
const modal=document.getElementById('modal');
const modalTitle=document.getElementById('modalTitle');
const modalBody=document.getElementById('modalBody');
function openModal(title,body){modalTitle.textContent=title;modalBody.innerHTML=body;modal.classList.remove('hidden');}
function closeModal(){modal.classList.add('hidden');}
document.getElementById('closeModal').onclick=closeModal;
window.onclick=(e)=>{if(e.target===modal)closeModal();};
document.getElementById('loginBtn').onclick=()=>openModal('Log In','<p>This is a demo login popup. We can connect real authentication next.</p>');
document.getElementById('signupBtn').onclick=()=>openModal('Sign Up','<p>This is a demo sign-up popup. We can connect Supabase or Firebase next.</p>');
document.getElementById('demoBtn').onclick=()=>openModal('Ask for Demo','<p>Email: demo@yoagronomist.com</p><p>Phone: +256 700 000000</p><p>Use this button as your investor and partner demo request flow.</p>');
function populateRegions(){Object.keys(districtsByRegion).forEach(r=>{const o=document.createElement('option');o.value=r;o.textContent=r;regionSelect.appendChild(o);});}
function populateDistricts(){districtSelect.innerHTML='';districtsByRegion[regionSelect.value].forEach(d=>{const o=document.createElement('option');o.value=d;o.textContent=d;districtSelect.appendChild(o);});showWeather();}
function showWeather(){weatherBox.textContent='Weather outlook: '+weatherByDistrict[districtSelect.value];}
regionSelect.addEventListener('change',populateDistricts);districtSelect.addEventListener('change',showWeather);
document.getElementById('generateBtn').onclick=()=>{const district=districtSelect.value;const crop=cropSelect.value;const farmerType=farmerTypeSelect.value;const weather=weatherByDistrict[district];const advice=`District: ${district}\nCrop: ${crop}\nFarmer Type: ${farmerType}\n\nWeather: ${weather}\n\nRecommendation: For ${crop.toLowerCase()} in ${district}, begin with timely land preparation, quality seed, correct spacing, early weed control, and close pest scouting. Plant after effective rains are confirmed. For commercial farmers, align planting with expected market demand and labor planning. For smallholders, prioritize affordable inputs and timely field operations.`;resultBox.textContent=advice;};
populateRegions();regionSelect.value='Western';populateDistricts();
