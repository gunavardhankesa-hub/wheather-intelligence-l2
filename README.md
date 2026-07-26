Weather Intelligence App — Level 2

A modern, responsive Weather Intelligence web application built using Google AI Studio App Build, version-controlled directly via GitHub, and deployed on Cloudflare Page. 
The application allows users to search for cities, convert locations into coordinates, display current weather metrics, view a 7-day forecast, and receive smart planning recommendations.

Project Overview & Features

-> City Search:Interactive location search with real-time API lookup.
-> Current Weather Metrics: Real-time display of current temperature and wind speed.
-> 7-Day Forecast: Detailed daily breakdown displaying maximum and minimum temperatures.
-> Interactive Charts: Temperature trend visualizer powered by Recharts.
-> Smart Planning Recommendations: Dynamic outdoor and travel suggestions based on real-time weather conditions.
-> Error Handling: Graceful error cards for non-existent cities or API failure states.


Open-Meteo API Information

This application uses public, open-access endpoints from the Open-Meteo API (no API key required):

| API Name | Endpoint URL | Purpose |
| Open-Meteo Geocoding API | `https://geocoding-api.open-meteo.com/v1/search` | Converts user-entered city names into exact latitude and longitude coordinates. |
| Open-Meteo Forecast API | `https://api.open-meteo.com/v1/forecast` | Fetches current weather and 7-day daily temperature forecast data.|


AI Studio Sync Workflow

This app source code was created and pushed directly to GitHub using Google AI Studio's direct GitHub connection workflow:

1. Generation: Built inside Google AI Studio App Build using the Level 2 Weather Intelligence prompt.
2. Direct Push: Used the direct Connect to GitHub integration within AI Studio to commit source files directly into this repository.
3. Guardrail Compliance: No private API keys, Gemini API keys, Firebase secrets, or GCP billing features were used.


Cloudflare Pages Build Parameters

The GitHub repository is linked directly to Cloudflare Pages for continuous deployment. 

Build Configuration Settings:
Framework Preset: `Vite` (or `React`)
Build Command: `npm run build`
Build Output Directory: `dist`
Production Branch: `main`

---

Single Page Application (SPA) Routing Setup

To prevent `404 Not Found` errors when refreshing routes on Cloudflare Pages, SPA redirect handling is configured:

1. A `_redirects` file is located in the `public/` directory.
2. **Redirect Rule Content:**
   ```text
   /* /index.html 200
