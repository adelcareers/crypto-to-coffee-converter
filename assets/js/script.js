const themeToggleButton = document.getElementById("themeToggle");
const form = document.getElementById("converterForm");
const cryptoIdInput = document.getElementById("cryptoIdInput");
const amountInput = document.getElementById("amountInput");
const coffeePriceInput = document.getElementById("coffeePriceInput");
const statusText = document.getElementById("statusText");
const cryptoValueEl = document.getElementById("cryptoValue");
const coffeeCountEl = document.getElementById("coffeeCount");
const noteText = document.getElementById("noteText");
const convertButton = document.getElementById("convertButton");

// This function applies the selected theme by toggling a class on the body.
function applyTheme(theme) {
	if (theme === "dark") {
		document.body.classList.add("theme-dark");
		themeToggleButton.textContent = "Switch to light mode";
		themeToggleButton.setAttribute("aria-pressed", "true");
	} else {
		document.body.classList.remove("theme-dark");
		themeToggleButton.textContent = "Switch to dark mode";
		themeToggleButton.setAttribute("aria-pressed", "false");
	}
}

// This function decides the starting theme based on saved preference or OS.
function getInitialTheme() {
	const savedTheme = localStorage.getItem("theme");
	if (savedTheme) {
		return savedTheme;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

applyTheme(getInitialTheme());

// This listener toggles themes and remembers the choice for next time.
themeToggleButton.addEventListener("click", () => {
	const nextTheme = document.body.classList.contains("theme-dark")
		? "light"
		: "dark";
	localStorage.setItem("theme", nextTheme);
	applyTheme(nextTheme);
});


// This helper formats numbers into USD currency for display.
function formatCurrency(value) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 2,
	}).format(value);
}

// This helper formats the coffee count to a friendly number.
function formatCount(value) {
	return Number.isFinite(value)
		? value.toLocaleString("en-US", { maximumFractionDigits: 2 })
		: "0";
}

// This function fetches the live USD price from CoinGecko.
async function fetchCoinPrice(coinId) {
	const url = new URL("https://api.coingecko.com/api/v3/simple/price");
	url.searchParams.set("ids", coinId);
	url.searchParams.set("vs_currencies", "usd");

	let response;
	try {
		response = await fetch(url.toString());
	} catch (error) {
		return { ok: false, error: "Network error while fetching prices." };
	}

	if (!response.ok) {
		return { ok: false, error: "Failed to fetch pricing data." };
	}

	let data;
	try {
		data = await response.json();
	} catch (error) {
		return { ok: false, error: "Invalid JSON returned from CoinGecko." };
	}

	if (!data[coinId] || typeof data[coinId].usd !== "number") {
		return {
			ok: false,
			error: "CoinGecko did not return a USD price for that asset.",
		};
	}

	return { ok: true, price: data[coinId].usd };
}

// This function uses if/else logic to calculate the coffee count safely.
function calculateCoffeeCount(totalValue, coffeePrice) {
	if (!Number.isFinite(totalValue) || !Number.isFinite(coffeePrice)) {
		return 0;
	} else if (totalValue <= 0 || coffeePrice <= 0) {
		return 0;
	}

	return totalValue / coffeePrice;
}

// This helper updates the status message and style.
function setStatus(message, type) {
	statusText.textContent = message;
	statusText.className = `status ${type || ""}`.trim();
}

// This listener validates input, fetches price, and updates the UI.
form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const coinId = cryptoIdInput.value.trim().toLowerCase();
	const amount = parseFloat(amountInput.value);
	const coffeePrice = parseFloat(coffeePriceInput.value);

	if (!coinId || !Number.isFinite(amount) || amount <= 0) {
		setStatus("Enter a valid coin ID and amount.", "error");
		noteText.textContent = "Example: bitcoin with amount 1.";
		return;
	} else if (!Number.isFinite(coffeePrice) || coffeePrice <= 0) {
		setStatus("Enter a valid coffee price.", "error");
		noteText.textContent = "Coffee price must be greater than 0.";
		return;
	}

	convertButton.disabled = true;
	setStatus("Fetching live price...", "");
	noteText.textContent = "";

	const priceResult = await fetchCoinPrice(coinId);
	if (priceResult.ok) {
		const totalValue = priceResult.price * amount;
		const coffeeCount = calculateCoffeeCount(totalValue, coffeePrice);

		cryptoValueEl.textContent = formatCurrency(totalValue);
		coffeeCountEl.textContent = formatCount(coffeeCount);

		setStatus("Conversion complete.", "success");
		noteText.textContent = `Using ${coinId.toUpperCase()} at ${formatCurrency(
			priceResult.price
		)} per coin.`;
	} else {
		setStatus(priceResult.error, "error");
		noteText.textContent = "Try another CoinGecko ID.";
		cryptoValueEl.textContent = "$0.00";
		coffeeCountEl.textContent = "0";
	}

	convertButton.disabled = false;
});
