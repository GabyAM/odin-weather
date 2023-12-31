import { weatherInterface } from "./interface.js";
import { debounce } from "./utilities.js";
import { weatherController } from "./weatherController.js";

export const domController = (function () {
	const icons = {
		// might change to fontawesome icons later
		sunny: "sunny",
		rain: "rainy",
		clear: "clear_night",
		cloudy: "filter_drama",
		overcast: "filter_drama",
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
			if (!isDay) icon.style.color = "var(--main-white)";
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
			} else if (conditionName.includes("fog")) {
				icon.textContent = icons.fog;
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
		if (icon.textContent) applyColor(icon.textContent, condition.isDay);

		element.appendChild(icon);
	}

	function showWeather(weather) {
		const $conditionText = document.querySelector(".card-condition h3");
		$conditionText.textContent = weather.condition.name;

		const $windSpeedText = document.querySelector(".card-wind-speed h3");
		$windSpeedText.textContent = `Wind speed: ${weather.windKph}km/h`;

		const $humidityText = document.querySelector(".card-humidity h3");
		$humidityText.textContent = `Humidity: ${weather.humidity}%`;

		const $rainChanceText = document.querySelector(".card-rain-chance h3");
		$rainChanceText.textContent = `Rain chance: ${weather.chanceOfRain}%`;

		const $cardThumbnail = document.querySelector(".card-thumbnail");
		$cardThumbnail.innerHTML = "";
		styleWeatherCard($cardThumbnail, weather.condition);
	}

	function loadButtons() {
		const $dayButtons = document.querySelectorAll(".day-button");
		$dayButtons.forEach((button, index) => {
			button.innerHTML = "";
			button.addEventListener("click", () => {
				weatherInterface.changeDay(index);
				const weather = weatherInterface.getMomentWeather();
				loadHours();
				showWeather(weather);
			});

			const title = document.createElement("h3");
			const text =
				index === 0 ? "Today" : weatherController.getDayTitle(index);
			title.textContent = text;
			button.appendChild(title);

			const condition = weatherController.getDayCondition(index);
			condition.isDay = true;
			styleWeatherCard(button, condition);
		});
	}

	function highlightHourButton(element) {
		const previousHighlighted = document.querySelector(".hour.selected");
		if (previousHighlighted) {
			previousHighlighted.classList.remove("selected");
		}
		element.classList.add("selected");
	}

	function addHourEvents(element) {
		function handleHourChange() {
			highlightHourButton(element);
			weatherInterface.changeHour(element.textContent);
			const weather = weatherInterface.getMomentWeather();
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
			if (name === weatherInterface.getSelectedHour()) {
				highlightHourButton(element);
			}
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

	let isScrolling = false;
	function handleScrollCallback(e) {
		function scrollCallback() {
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
		}

		if (!isScrolling) {
			scrollCallback();
			isScrolling = true;
			setTimeout(() => {
				isScrolling = false;
			}, 50);
		}
	}

	const debouncedScroll = debounce(handleScrollCallback, 100);
	$hoursDiv.addEventListener("wheel", (e) => debouncedScroll(e));

	const $submitCityButton = document.querySelector(".city-input button");
	$submitCityButton.addEventListener("click", (event) => {
		event.stopPropagation();
		const $input = document.querySelector(".city-input input");
		if (weatherInterface.validateCityName($input)) {
			update();
		}
	});

	function setCityTitle() {
		const $title = document.querySelector(".city-text h1");
		const location = weatherInterface.getLocation();
		$title.textContent = `${location.name}, ${location.country} `;
	}

	async function update() {
		try {
			await weatherInterface.update();
			loadButtons();
			loadHours();
			setCityTitle();
			showWeather(weatherController.getCurrentWeather());
		} catch (error) {
			console.log(error);
		}
	}

	return { update };
})();
