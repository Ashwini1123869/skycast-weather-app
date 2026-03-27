# SkyCast Weather App 🌤️

**SkyCast** is a premium, interactive weather application built with Vanilla JS, HTML, and CSS. It provides highly accurate real-time weather forecasts integrated with a custom HTML5 canvas-based particle engine that generates beautiful, dynamic ambient weather effects.

## ✨ Features

- **Live Ambient Weather Effects:** A custom Canvas particle engine renders real-time visuals like horizontal wind gusts, falling snow, rain, glowing sun rays, and fluttering cherry blossoms tailored precisely to the current temperature and weather.
- **Global Desert Adaptation:** Special tracking automatically detects desert regions (such as Rajasthan, Dubai, and the Mojave) to render specialized sandstorm particles and a unique desert color gradient theme.
- **Comprehensive Geocoding:** Powered by the Nominatim (OpenStreetMap) API to support complex location lookups, easily identifying every city, town, village, and state globally without any missing regions.
- **Dynamic Glassmorphism UI:** A sleek, modern user interface featuring blur effects that fluidly changes its entire color palette and theme based on current weather conditions.
- **"Desi" Mood Advisories:** Fun, localized mood quotes and weather advisories for extra personality.
- **Audio Integration:** Ambient weather sounds that match your current weather state dynamically.
- **Responsive Design:** Fully responsive layout tailored for both mobile devices and desktop orientations.

## 🚀 Built With

- **HTML5 & Vanilla CSS:** For structural semantic content, responsive layout, and state-of-the-art glassmorphic styling elements.
- **Vanilla JavaScript:** For API integration, asynchronous DOM manipulation, debounced auto-suggest, and the high-performance custom particle animation loop.
- **Open-Meteo API:** Used natively for reliable, detailed, and speedy real-time weather forecasting.
- **Nominatim API:** Used for accurate, globally expansive geocoding and real-time location suggestion fetching.
- **Vite:** Handled via Node.js as the lightning-fast build tool and local development server.

## 🛠️ Usage / Installation

To view and run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/Ashwini1123869/skycast-weather-app.git
   ```
2. Navigate into the application directory:
   ```bash
   cd skycast-weather-app
   ```
3. Install development dependencies:
   ```bash
   npm install
   ```
4. Start the local Vite development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment
To compile and deploy this project to the web:
1. Run `npm run build` to automatically bundle and generate the highly optimized production build into a localized `dist/` tracking folder.
2. Upload the `dist/` folder to a service like Netlify, or deploy automatically by connecting your repository directly to Vercel or GitHub Pages.
