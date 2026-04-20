const districtsByRegion = {
  Western: ["Mbarara", "Ibanda", "Kabale", "Fort Portal", "Hoima"],
  Northern: ["Gulu", "Lira", "Arua", "Kitgum", "Nebbi"],
};

const regionEl = document.getElementById('region');
const districtEl = document.getElementById('district');
const cropEl = document.getElementById('crop');
const farmerTypeEl = document.getElementById('farmerType');
const soilTypeEl = document.getElementById('soilType');
const farmSizeEl = document.getElementById('farmSize');
const questionEl = document.getElementById('question');
const adviceBtn = document.getElementById('adviceBtn');
const adviceOutput = document.getElementById('adviceOutput');
const weatherBox = document.getElementById('weatherBox');
const messageBox = document.getElementById('messageBox');
const authStatus = document.getElementById('authStatus');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const signUpBtn = document.getElementById('signUpBtn');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

let supabase = null;

function fillDistricts() {
  const region = regionEl.value;
  districtEl.innerHTML = districtsByRegion[region].map(d => `<option>${d}</option>`).join('');
}

async function fetchWeather(district) {
  try {
    weatherBox.textContent = 'Loading weather...';
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(district)}&count=1&language=en&format=json`);
    const geoData = await geo.json();
    const place = geoData?.results?.[0];
    if (!place) throw new Error('Location not found');
    const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=3`);
    const weatherData = await weather.json();
    const days = weatherData.daily.time.map((date, i) => {
      return `${date}: rain ${weatherData.daily.precipitation_sum[i]} mm, min ${weatherData.daily.temperature_2m_min[i]}°C, max ${weatherData.daily.temperature_2m_max[i]}°C`;
    }).join('\n');
    weatherBox.textContent = `${place.name}, ${place.country}\n${days}`;
    return { place, weatherData };
  } catch (err) {
    weatherBox.textContent = `Weather load failed: ${err.message}`;
    return null;
  }
}

function initSupabase() {
  if (window.APP_CONFIG?.SUPABASE_URL && window.APP_CONFIG?.SUPABASE_ANON_KEY) {
    supabase = window.supabase.createClient(window.APP_CONFIG.SUPABASE_URL, window.APP_CONFIG.SUPABASE_ANON_KEY);
  }
}

async function refreshAuth() {
  if (!supabase) {
    authStatus.textContent = 'Supabase not configured yet.';
    return;
  }
  const { data } = await supabase.auth.getSession();
  const user = data?.session?.user;
  authStatus.textContent = user ? `Signed in: ${user.email}` : 'Not signed in';
}

async function signUp() {
  if (!supabase) return authStatus.textContent = 'Supabase not configured.';
  const email = authEmail.value.trim();
  const password = authPassword.value.trim();
  const { error } = await supabase.auth.signUp({ email, password });
  authStatus.textContent = error ? error.message : 'Sign-up submitted. Check email if confirmation is enabled.';
}

async function signIn() {
  if (!supabase) return authStatus.textContent = 'Supabase not configured.';
  const email = authEmail.value.trim();
  const password = authPassword.value.trim();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  authStatus.textContent = error ? error.message : `Signed in: ${email}`;
}

async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
  authStatus.textContent = 'Signed out';
}

async function generateAdvice() {
  const district = districtEl.value;
  const crop = cropEl.value;
  const farmerType = farmerTypeEl.value;
  const soilType = soilTypeEl.value;
  const farmSize = farmSizeEl.value;
  const question = questionEl.value.trim();

  messageBox.textContent = 'Generating AI advice...';
  adviceOutput.textContent = '';

  const weatherPayload = await fetchWeather(district);

  try {
    const res = await fetch('/api/advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        district,
        crop,
        farmerType,
        soilType,
        farmSize,
        question,
        weather: weatherPayload,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Advice failed');
    adviceOutput.textContent = data.advice;
    messageBox.textContent = 'Advice generated.';
  } catch (err) {
    messageBox.textContent = `Error: ${err.message}`;
  }
}

regionEl.addEventListener('change', fillDistricts);
signUpBtn.addEventListener('click', signUp);
signInBtn.addEventListener('click', signIn);
signOutBtn.addEventListener('click', signOut);
adviceBtn.addEventListener('click', generateAdvice);

fillDistricts();
initSupabase();
refreshAuth();
fetchWeather(districtEl.value);
