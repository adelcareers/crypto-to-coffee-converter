# Crypto-to-Coffee Converter

Convert a crypto holding into real-world coffee equivalents using live pricing
from the CoinGecko public API.

## Features

- Light/dark theme toggle
- Live conversion with error handling
- Responsive layout for mobile and desktop

## Run locally

Open [index.html](index.html) in a browser.

Optional local server:

~~~bash
python3 -m http.server 8080
~~~

Then open http://localhost:8080.

## Deployment (GitHub Pages)

1. Push changes to main.
2. In GitHub repo settings, enable Pages from the main branch root.
3. Open the Pages URL and verify the converter and theme toggle.

## Screenshots

- Light mode: screenshots/light.png
- Dark mode: screenshots/dark.png

## AI reflection

- Used a simple fetch wrapper with clear if/else error handling.
- Kept UI state updates isolated for readability and learning.
- Used CSS variables for theme switching and consistent contrast.
