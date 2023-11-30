import { weatherController } from "./weatherController.js";

export const weatherInterface = (function () {
	function changeHour(newHour) {
		weatherController.setHour(newHour);
	}
	function changeDay(dayIndex) {
		weatherController.setDay(dayIndex);
	}

	function getDayWeather(dayIndex) {
		changeDay(dayIndex);
		return weatherController.getDayWeather();
	}

	function isToday() {
		const dateNow = weatherController.getDayWeather().date;
		const dateFirstDay = weatherController.getDayWeather(0).date;
		return dateNow === dateFirstDay;
	}

	function getLocation() {
		return weatherController.getLocation();
	}

	function getSelectedHour() {
		return weatherController.getCurrentHour();
	}

	function getMomentWeather() {
		return weatherController.getMomentWeather();
	}

	function validateCityName(input) {
		const $errorSpan = document.querySelector(".city-input span");

		function setError(errorMessage) {
			$errorSpan.classList.add("error");
			input.classList.add("error");
			$errorSpan.textContent = errorMessage;
		}

		if (input.validity.valid) {
			if (input.classList.contains("error")) {
				input.classList.remove("error");
				$errorSpan.classList.remove("error");
			}

			weatherController.setCity(input.value);
			return true;
		} else {
			$errorSpan.style.visibility = "visible";
			if (input.validity.valueMissing) {
				setError("You need to input a city");
			} else if (input.validity.tooLong) {
				setError("The city name is too long");
			} else if (input.validity.patternMismatch) {
				setError("You need to enter a valid name");
			}
			return false;
		}
	}

	async function update() {
		await weatherController.update();
	}

	return {
		changeDay,
		changeHour,
		getMomentWeather,
		isToday,
		getLocation,
		validateCityName,
		update,
		getSelectedHour,
	};
})();
