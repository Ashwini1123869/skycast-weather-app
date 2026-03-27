const API_GEO = "https://nominatim.openstreetmap.org/search";
const API_WEATHER = "https://api.open-meteo.com/v1/forecast";

const elements = {
    searchBtn: document.getElementById('searchBtn'),
    locationInput: document.getElementById('locationInput'),
    weatherOutput: document.getElementById('weatherOutput'),
    cityName: document.getElementById('cityName'),
    currentDate: document.getElementById('currentDate'),
    currentTemp: document.getElementById('currentTemp'),
    weatherDesc: document.getElementById('weatherDesc'),
    weatherIcon: document.getElementById('weatherIcon'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    uvIndex: document.getElementById('uvIndex'),
    hourlyForecast: document.getElementById('hourlyForecast'),
    dailyForecast: document.getElementById('dailyForecast'),
    errorMsg: document.getElementById('errorMsg'),
    loader: document.getElementById('loader'),
    suggestions: document.getElementById('suggestions'),
    desiMood: document.getElementById('desiMood'),
    moodText: document.getElementById('moodText'),
    canvas: document.getElementById('weatherCanvas')
};

// --- DATA & CONFIG ---
const weatherCodes = {
    0: { desc: "Clear Sky", icon: "https://openweathermap.org/img/wn/01d@2x.png", sound: "https://www.soundjay.com/misc/sounds/wind-chime-1.mp3", hotSound: "https://www.soundjay.com/nature/sounds/cicadas-1.mp3", type: 'clear' },
    1: { desc: "Mainly Clear", icon: "https://openweathermap.org/img/wn/01d@2x.png", sound: "https://www.soundjay.com/misc/sounds/wind-chime-1.mp3", hotSound: "https://www.soundjay.com/nature/sounds/cicadas-1.mp3", type: 'clear' },
    2: { desc: "Partly Cloudy", icon: "https://openweathermap.org/img/wn/02d@2x.png", sound: "https://www.soundjay.com/nature/sounds/wind-hissing-01.mp3", type: 'cloudy' },
    3: { desc: "Overcast", icon: "https://openweathermap.org/img/wn/03d@2x.png", sound: "https://www.soundjay.com/nature/sounds/wind-hissing-01.mp3", type: 'cloudy' },
    45: { desc: "Fog", icon: "https://openweathermap.org/img/wn/50d@2x.png", sound: "https://www.soundjay.com/nature/sounds/wind-hissing-01.mp3", type: 'cloudy' },
    51: { desc: "Drizzle", icon: "https://openweathermap.org/img/wn/09d@2x.png", sound: "https://www.soundjay.com/nature/sounds/rain-07.mp3", type: 'rain' },
    61: { desc: "Rain", icon: "https://openweathermap.org/img/wn/10d@2x.png", sound: "https://www.soundjay.com/nature/sounds/rain-07.mp3", type: 'rain' },
    71: { desc: "Snow", icon: "https://openweathermap.org/img/wn/13d@2x.png", sound: "https://www.soundjay.com/nature/sounds/wind-hissing-01.mp3", type: 'snow' },
    95: { desc: "Storm", icon: "https://openweathermap.org/img/wn/11d@2x.png", sound: "https://www.soundjay.com/nature/sounds/thunderstorm-01.mp3", type: 'storm' }
};

const desiAdvices = {
    clear: [
        "Bhai, bahaar tandoor ban raha hai, nikalna hai to nimbu-paani saath rakhna! 🍋🔥",
        "Aaj to suraj chacha full mood mein hain, AC ON rakho aur thanda piyo! 🧊",
        "Clear sky hai bhai, sham ko ghoomne nikal jao, par dhoop mein nahi! 😎"
    ],
    rain: [
        "Mausam awesome hai! Office ka kaam chhodo, pakode aur chai ka intezam karo! ☕🌧️",
        "Baarish ho rahi hai bhai, chhatri bhool gaye to bheegi billi ban jaoge! ☔😸",
        "Ghar pe raho aur Netflix chalao, bahaar to swimming pool ban gaya hoga! 🏊‍♂️"
    ],
    cloudy: [
        "Mausam thoda confuse hai, shayad baarish ho jaye. Taiyaar rehna! ☁️🤔",
        "Badal hi badal hain, aaj dhoop se chhutti! Chai ka ek cup to banta hai. ☕",
        "Ghoomne ke liye best time hai, na bohot dhoop na bohot thand! 🚶‍♂️"
    ],
    snow: [
        "Bhai, shimla ban gaya hai mohalla! Kambal mein ghuse raho. ❄️🥶",
        "Snowfall ho rahi hai? Snowman banao aur thandi ka maza lo! ☃️",
        "Garm chaye aur rajai—bas yahi chahiye aaj! ☕🛌"
    ],
    storm: [
        "Bhai, bijli kadak rahi hai! Phone side mein rakho aur darr ke raho! ⚡😱",
        "Toofan aaya hai, ud mat jana! Khidkiyan band rakho. 🏠🌪️",
        "Aaj bahaar gaya to seedha 'Flying Jatt' ban jayega! Ghar pe raho. 💨"
    ]
};

// --- AUDIO SYSTEM ---
let audio = new Audio();
audio.loop = true;
audio.volume = 0.4;
let isSoundEnabled = true;

// --- PARTICLE SYSTEM (CANVAS) ---
const ctx = elements.canvas.getContext('2d');
let particles = [];
let animationId;
let currentWeatherType = 'clear';

function resizeCanvas() {
    elements.canvas.width = window.innerWidth;
    elements.canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(type) {
        this.type = type;
        this.reset();
    }
    reset() {
        this.x = Math.random() * elements.canvas.width;
        this.y = Math.random() * elements.canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 1;
        if (this.type === 'rain') {
            this.y = -20;
            this.speedY = Math.random() * 10 + 10;
            this.length = Math.random() * 15 + 10;
        } else if (this.type === 'snow') {
            this.y = -20;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 2;
        } else if (this.type === 'sun') {
            this.angle = Math.random() * Math.PI * 2;
            this.distance = Math.random() * elements.canvas.width;
            this.speed = Math.random() * 0.005 + 0.002;
        } else if (this.type === 'cherry') {
            this.x = Math.random() * elements.canvas.width;
            this.y = -20 - Math.random() * 50;
            this.size = Math.random() * 3 + 2;
            this.speedY = Math.random() * 1.5 + 0.8;
            this.speedX = (Math.random() - 0.5) * 2;
            this.angle = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.05;
        } else if (this.type === 'wind') {
            this.x = -50 - Math.random() * 200;
            this.y = Math.random() * elements.canvas.height;
            this.length = Math.random() * 150 + 50;
            this.speedX = Math.random() * 25 + 15;
            this.speedY = (Math.random() - 0.5) * 3;
            this.opacity = Math.random() * 0.5 + 0.2;
        } else if (this.type === 'sand') {
            this.x = -50 - Math.random() * 200;
            this.y = Math.random() * elements.canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 10 + 5;
            this.speedY = (Math.random() - 0.5) * 2;
            this.opacity = Math.random() * 0.6 + 0.2;
        }
    }
    update() {
        if (this.type === 'sun') {
            this.angle += this.speed;
        } else if (this.type === 'wind') {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > elements.canvas.width + 100) this.reset();
        } else if (this.type === 'sand') {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > elements.canvas.width + 100) this.reset();
        } else if (this.type === 'cherry') {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.015) * 0.8;
            this.angle += this.spin;
            if (this.y > elements.canvas.height + 30) this.reset();
        } else {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y > elements.canvas.height) this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        if (this.type === 'rain') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.length);
            ctx.stroke();
        } else if (this.type === 'snow') {
            ctx.fillStyle = 'white';
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'sun') {
            const centerX = elements.canvas.width / 2;
            const centerY = -100;
            const endX = centerX + Math.cos(this.angle) * elements.canvas.width * 1.5;
            const endY = centerY + Math.sin(this.angle) * elements.canvas.height * 1.5;

            const gradient = ctx.createLinearGradient(centerX, centerY, endX, endY);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(endX - 50, endY);
            ctx.lineTo(endX + 50, endY);
            ctx.fill();
        } else if (this.type === 'cherry') {
            ctx.fillStyle = 'rgba(255, 183, 197, 0.85)';
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(this.size, this.size * 1.5, 0, this.size * 3);
            ctx.quadraticCurveTo(-this.size, this.size * 1.5, 0, 0);
            ctx.fill();
            ctx.restore();
        } else if (this.type === 'sand') {
            ctx.fillStyle = `rgba(210, 180, 140, ${this.opacity})`; // Tan color
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'wind') {
            const tailX = this.x - this.length;
            const tailY = this.y - (this.speedY / this.speedX) * this.length;
            const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();
            ctx.lineCap = 'butt';
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    animationId = requestAnimationFrame(animate);
}

function setWeatherEffect(type, windSpeed = 0, temperature = 20) {
    currentWeatherType = type;
    particles = [];
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);

    if (type === 'rain' || type === 'storm') {
        for (let i = 0; i < 150; i++) particles.push(new Particle('rain'));
    }

    if (type === 'desert') {
        for (let i = 0; i < 70; i++) {
            let p = new Particle('sand');
            p.x = Math.random() * elements.canvas.width;
            particles.push(p);
        }
    } else if (type === 'snow' || temperature < 15) {
        for (let i = 0; i < 100; i++) {
            let p = new Particle('snow');
            p.y = Math.random() * elements.canvas.height;
            particles.push(p);
        }
    } else if (temperature >= 15 && temperature <= 28) {
        for (let i = 0; i < 40; i++) {
            let p = new Particle('cherry');
            p.y = Math.random() * elements.canvas.height;
            particles.push(p);
        }
    } else if (temperature > 28) {
        for (let i = 0; i < 8; i++) particles.push(new Particle('sun'));
    }

    if (windSpeed > 5) {
        let count = Math.min(Math.floor(windSpeed * 5), 100);
        for (let i = 0; i < count; i++) {
            let p = new Particle('wind');
            p.x = Math.random() * elements.canvas.width;
            particles.push(p);
        }
    }

    if (particles.length > 0) animate();
}

// --- CORE LOGIC ---
const getWeatherInfo = (code) => {
    for (let key in weatherCodes) {
        if (
            code == key ||
            (code >= 51 && code <= 67 && key == 61) ||
            (code >= 80 && code <= 82 && key == 61) ||
            (code >= 71 && code <= 77 && key == 71) ||
            (code >= 85 && code <= 86 && key == 71) ||
            (code >= 95 && code <= 99 && key == 95)
        ) {
            return weatherCodes[key];
        }
    }
    return { desc: "Cloudy", icon: "https://openweathermap.org/img/wn/03d@2x.png", type: 'cloudy', sound: "https://www.soundjay.com/nature/sounds/wind-hissing-01.mp3" };
};

const getThemeClass = (type) => {
    const map = { clear: 'theme-sunny', cloudy: 'theme-cloudy', rain: 'theme-rainy', snow: 'theme-snowy', storm: 'theme-stormy', desert: 'theme-desert' };
    return map[type] || 'theme-default';
};

// --- DEBOUNCE UTILITY ---
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Auto-suggest
const fetchSuggestions = async (query) => {
    if (query.length < 2) { elements.suggestions.classList.add('hidden'); return; }
    try {
        // Using Nominatim for much broader coverage including states like Rajasthan
        const res = await fetch(`${API_GEO}?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`);
        const data = await res.json();

        if (data && data.length > 0) {
            elements.suggestions.innerHTML = data.map(loc => {
                const nameParts = loc.display_name.split(', ');
                const mainName = nameParts[0];
                const subName = nameParts.slice(1).join(', ');
                return `
                    <div class="suggestion-item" data-lat="${loc.lat}" data-lon="${loc.lon}" data-name="${loc.display_name}">
                        <strong>${mainName}</strong>, <span style="font-size:0.85em; opacity:0.8">${subName}</span>
                    </div>
                `;
            }).join('');
            elements.suggestions.classList.remove('hidden');
        } else {
            elements.suggestions.classList.add('hidden');
        }
    } catch (err) { }
};

// Increased debounce to 500ms to respect Nominatim API rate limits
elements.locationInput.addEventListener('input', debounce((e) => fetchSuggestions(e.target.value.trim()), 500));

elements.suggestions.addEventListener('click', (e) => {
    const item = e.target.closest('.suggestion-item');
    if (item) {
        elements.locationInput.value = item.dataset.name;
        elements.suggestions.classList.add('hidden');
        fetchWeather(item.dataset.lat, item.dataset.lon, item.dataset.name);
    }
});

elements.searchBtn.addEventListener('click', () => handleSearch());
elements.locationInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearch(); });

async function handleSearch() {
    const query = elements.locationInput.value.trim();
    if (!query) return;
    showLoader(true);
    try {
        const geoRes = await fetch(`${API_GEO}?q=${encodeURIComponent(query)}&format=json&limit=1`);
        const geoData = await geoRes.json();
        if (!geoData || geoData.length === 0) { showError(true); return; }
        const loc = geoData[0];
        const nameParts = loc.display_name.split(', ');
        const shortName = nameParts[0] + (nameParts.length > 1 ? ', ' + nameParts[nameParts.length - 1] : '');
        fetchWeather(loc.lat, loc.lon, shortName);
    } catch (err) { showError(true); }
}

async function fetchWeather(lat, lon, name) {
    showLoader(true); showError(false);
    try {
        const res = await fetch(`${API_WEATHER}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await res.json();
        updateUI(data, name);
    } catch (err) { showError(true); } finally { showLoader(false); }
}

function updateUI(data, name) {
    const current = data.current;
    const info = getWeatherInfo(current.weather_code);

    const isDesert = ['rajasthan', 'dubai', 'sahara', 'nevada', 'arizona', 'thar', 'kutch', 'gobi', 'kalahari', 'mojave', 'saudi', 'oman', 'egypt', 'kuwait', 'qatar'].some(d => name.toLowerCase().includes(d));

    let themeType = info.type;
    // Desert gets special treatment if it's currently hot and clear/cloudy
    if (isDesert && current.temperature_2m > 20 && !['rain', 'snow', 'storm'].includes(info.type)) {
        themeType = 'desert';
    }

    document.body.className = getThemeClass(themeType);
    setWeatherEffect(themeType, current.wind_speed_10m, current.temperature_2m);

    // Dynamic Sound Selection
    let finalSound = info.sound;
    if (info.type === 'clear' && current.temperature_2m > 30) {
        finalSound = info.hotSound || info.sound;
    }

    // Audio handling
    if (finalSound) {
        if (audio.src !== finalSound) {
            audio.src = finalSound;
            if (isSoundEnabled) audio.play().catch(() => { });
        }
    } else {
        audio.pause();
    }

    // Desi Mood
    const advices = desiAdvices[info.type] || desiAdvices.cloudy;
    const currentAdvice = advices[Math.floor(Math.random() * advices.length)];
    elements.moodText.innerText = currentAdvice;
    elements.desiMood.classList.remove('hidden');

    elements.cityName.innerText = name;
    elements.currentDate.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    elements.currentTemp.innerText = Math.round(current.temperature_2m);
    elements.weatherDesc.innerText = info.desc;
    elements.weatherIcon.src = info.icon;
    elements.humidity.innerText = `${current.relative_humidity_2m}%`;
    elements.windSpeed.innerText = `${current.wind_speed_10m} km/h`;

    // Hourly
    const currentIso = data.current.time.split(':')[0] + ':00';
    let nowIdx = data.hourly.time.findIndex(h => h === currentIso);
    if (nowIdx === -1) nowIdx = 0;
    elements.hourlyForecast.innerHTML = data.hourly.time.slice(nowIdx, nowIdx + 12).map((time, idx) => {
        const hInfo = getWeatherInfo(data.hourly.weather_code[nowIdx + idx]);
        return `
            <div class="hourly-item ${idx === 0 ? 'now' : ''}">
                <div class="time">${idx === 0 ? "Now" : idx === 1 ? "1h later" : new Date(time).getHours() + ":00"}</div>
                <img src="${hInfo.icon}" alt="Icon">
                <div class="temp">${Math.round(data.hourly.temperature_2m[nowIdx + idx])}°</div>
            </div>
        `;
    }).join('');

    // Daily
    elements.dailyForecast.innerHTML = data.daily.time.map((date, idx) => {
        const dInfo = getWeatherInfo(data.daily.weather_code[idx]);
        return `
            <div class="daily-item">
                <span class="day">${idx === 0 ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <div class="daily-weather"><img src="${dInfo.icon}" alt="Icon"> <span>${dInfo.desc}</span></div>
                <div class="daily-temps"><span class="max">${Math.round(data.daily.temperature_2m_max[idx])}°</span><span class="min">${Math.round(data.daily.temperature_2m_min[idx])}°</span></div>
            </div>
        `;
    }).join('');

    elements.weatherOutput.classList.remove('hidden');
}

function showLoader(show) { elements.loader.classList.toggle('hidden', !show); }
function showError(show) { elements.errorMsg.classList.toggle('hidden', !show); elements.weatherOutput.classList.add('hidden'); if (show) showLoader(false); }

document.addEventListener('click', (e) => { if (!elements.locationInput.contains(e.target)) elements.suggestions.classList.add('hidden'); });
window.onload = () => showLoader(false);
