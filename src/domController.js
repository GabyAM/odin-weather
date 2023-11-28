import { weatherController } from "./weatherController.js";

export const domController = (function () {
	const icons = {
		// might change to fontawesome icons later
		sunny: "sunny",
		rain: "rainy",
		clear: "clear_night",
		cloudy: "filter_drama",
		"partly cloudy": "partly_cloudy_day",
		fog: "foggy",
		mist: "mist",
		sleet: "weather_hail",
		snow: "cloudy_snowing",
		thunder: "thunderstorm",
	};

	function styleDayButton(button, condition) {
		function isWordInObject(word) {
			return Object.keys(icons).some((key) => word.includes(key));
		}

		function applyColor(value) {
			const name = Object.keys(icons).find((key) => icons[key] === value);

			button.classList.add(name.replace(/ /g, "-"));
		}
		let icon;
		if (isWordInObject(condition.name.toLowerCase())) {
			icon = document.createElement("span");
			icon.className = "material-symbols-outlined";
			const conditionName = condition.name.toLowerCase();

			if (conditionName.includes("rain")) {
				icon.textContent = icons.rain;
			} else if (conditionName.includes("sleet")) {
				icon.textContent = icons.sleet;
			} else if (conditionName.includes("snow")) {
				icon.textContent = icons.snow;
			} else if (conditionName.includes("thunder")) {
				icon.textContent = icons.thunder;
			} else {
				icon.textContent = icons[conditionName];
			}
		} else {
			icon = document.createElement("img");
			icon.src = condition.icon;
		}

		if (icon.textContent) applyColor(icon.textContent);

		button.appendChild(icon);
	}
	function showWeather(weather) {
		const weatherElement = document.querySelector(".weather");
		const conditionText = document.createElement("h3");
		conditionText.textContent = weather.condition.name;
		weatherElement.appendChild(conditionText);
	}

	function loadButtons() {
		const $dayButtons = document.querySelectorAll(".day-button");
		$dayButtons.forEach(async (button, index) => {
			button.addEventListener("click", () => {
				const weather = weatherController.getMomentWeather(index);
				showWeather(weather);
			});

			const condition = await weatherController.getDayCondition(index);
			styleDayButton(button, condition);
		});
	}

	return { loadButtons };
	function init() {
		loadButtons();
	}

	return { init };
})();
