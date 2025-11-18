# weather
weather app

EurOrbit – European 7-Day Weather Forecast

A lightweight web app that displays 7-day weather forecasts for major European cities using the 7Timer! API.
Built with HTML, CSS, and vanilla JavaScript, this project demonstrates asynchronous API calls, JSON processing, and dynamic DOM rendering.

🌍 Live Features

Select cities from a dropdown

Fetch 7-day forecast from 7Timer! (civillight)

Asynchronous fetch() API calls

Local cities.json file for city metadata

Dynamic forecast cards with icons, dates, and temps

Clean responsive layout

📁 Project Structure
.
├── index.html        # Webpage UI
├── styles.css        # Layout + design
├── app.js            # API calls + rendering logic
├── cities.json       # City list with lat/lon
└── README.md

⚙️ How It Works
1. Load Cities (Local JSON)
const res = await fetch("cities.json");
const data = await res.json();

2. Call 7Timer API

Example request:

https://www.7timer.info/bin/api.pl?lon=24.93&lat=60.16&product=civillight&output=json


JavaScript:

const res = await fetch(url);
const data = await res.json();

3. Render Forecast Cards

Each day includes:

Date

Weather condition

Emoji icon

Daily temperature

Wind speed

🚀 Running Locally
Option 1 — VS Code Live Server

Right-click index.html → Open with Live Server

Option 2 — Node Local Server
npx serve


Then open the provided local link in your browser.

Note: Directly opening index.html may block cities.json due to browser security.

🗂️ cities.json Example
{
  "cities": [
    { "id": "helsinki", "name": "Helsinki, Finland", "lat": 60.1695, "lon": 24.9354 }
  ]
}


Add more cities as needed.

🛰️ API Used

7Timer! Weather API
Documentation: http://www.7timer.info/doc.php?lang=en

Product: civillight (best for daily forecasts)

📝 License

This project is for personal, educational, and demonstration purposes.
Weather data © 7Timer!.
