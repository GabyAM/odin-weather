import { weatherInterface } from "./interface.js";
import { weatherController } from "./weatherController.js";

export const domController = (function () {
	const icons = {
		// might change to fontawesome icons later
		sunny: "sunny",
		rain: "rainy",
		clear: "clear_night",
		cloudy: "filter_drama",
		"partly-cloudy": "partly_cloudy",
		fog: "foggy",
		mist: "mist",
		sleet: "weather_hail",
		snow: "cloudy_snowing",
		thunder: "thunderstorm",
	};

	function styleWeatherCard(element, condition) {
		function isWordInObject(word) {
			return Object.keys(icons).some((key) => word.includes(key));
		}

		function applyColor(value, isDay) {
			if (value.includes("partly_cloudy")) value = value.slice(0, 13);
			const name = Object.keys(icons).find((key) => icons[key] === value);
			const firstColor = `var(--card-main${!isDay ? "-night" : ""})`;
			const secondColor = `var(--card-${
				name === "clear" ? "main" : name
			})`;
			element.style.background = `linear-gradient(to bottom, ${firstColor}, ${secondColor})`;
		}
		let icon;
		const conditionName = condition.name.toLowerCase().replace(/ /g, "-");
		if (isWordInObject(conditionName)) {
			icon = document.createElement("span");
			icon.className = "material-symbols-outlined";
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
				if (conditionName === "partly-cloudy") {
					icon.textContent += condition.isDay ? "_day" : "_night";
				}
			}
		} else {
			icon = document.createElement("img");
			icon.src = condition.icon;
		}
		console.log(icon.textContent);
		if (icon.textContent) applyColor(icon.textContent, condition.isDay);

		element.appendChild(icon);
	}

	function showWeather(weather) {
		const weatherElement = document.querySelector(".weather");
		const conditionText = document.createElement("h3");
		conditionText.textContent = weather.condition.name;
		weatherElement.appendChild(conditionText);
		const $cardThumbnail = document.querySelector(".card-thumbnail");
		$cardThumbnail.innerHTML = "";
		styleWeatherCard($cardThumbnail, weather.condition);
	}

	function loadButtons() {
		const $dayButtons = document.querySelectorAll(".day-button");
		$dayButtons.forEach(async (button, index) => {
			button.addEventListener("click", () => {
				const weather = weatherController.getMomentWeather(index);
				showWeather(weather);
			});

			const title = document.createElement("h3");
			const text = await weatherController.getDayTitle(index);
			title.textContent = text;
			button.appendChild(title);

			const condition = await weatherController.getDayCondition(index);
			condition.isDay = true;
			styleWeatherCard(button, condition);
		});
	}

	function addHourEvents(element) {
		function highlightElement(element) {
			const hours = document.querySelectorAll(".hour");
			hours.forEach((hour) => {
				if (hour.classList.contains("selected")) {
					hour.classList.remove("selected");
				}
			});
			element.classList.add("selected");
		}
		function handleHourChange() {
			highlightElement(element);
			const weather =
				element.textContent === "Now"
					? weatherController.getCurrentWeather()
					: weatherInterface.getHourWeather(element.textContent);
			showWeather(weather);
		}

		element.removeEventListener("click", handleHourChange);

		if (!element.hasAttribute("data-event-bound")) {
			element.addEventListener("click", handleHourChange);
			element.setAttribute("data-event-bound", true);
		}
	}

	const $hoursDiv = document.querySelector(".hour-selection");
	function loadHours() {
		function createHourElement(name) {
			const element = document.createElement("button");
			element.className = "hour";
			element.textContent = name;
			addHourEvents(element);
			$hoursDiv.appendChild(element);
		}

		$hoursDiv.innerHTML = "";
		if (weatherInterface.isToday()) {
			createHourElement("Now");
		}
		const hours = weatherController.getDayWeather().hours;
		hours.forEach((hour) => {
			createHourElement(hour.time);
		});
	}

	$hoursDiv.addEventListener("wheel", (e) => {
		e.preventDefault();
		if (e.deltaY > 0) {
			$hoursDiv.scrollTo({
				left: ($hoursDiv.scrollLeft += 100),
				behavior: "smooth",
			});
		} else {
			$hoursDiv.scrollTo({
				left: ($hoursDiv.scrollLeft -= 100),
				behavior: "smooth",
			});
		}
	});

	function init() {
		loadButtons();
		loadHours();
	}

	return { init };
})();
