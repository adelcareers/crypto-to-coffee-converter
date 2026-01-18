const themeToggleButton = document.getElementById("themeToggle");

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
