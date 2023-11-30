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

	// this code could go in an error module?

	const error = document.querySelector(".city-input span");
	const input = document.querySelector(".city-input input");

	function removeError() {
		if (input.classList.contains("error")) {
			input.classList.remove("error");
			error.classList.remove("error");
		}
	}

	function setError(errorMessage) {
		error.classList.add("error");
		input.classList.add("error");
		error.textContent = errorMessage;

		function handleClickOutside(e) {
			if (
				e.target !== input &&
				e.target !== document.querySelector(".city-input button")
			) {
				removeError();
			}
		}

		document
			.querySelector("body")
			.addEventListener("click", handleClickOutside, {
				once: true,
			});
	}

	function validateCityName() {
		const isPrevious = input.value === getLocation().name.toLowerCase();
		if (input.validity.valid && !isPrevious) {
			removeError();
			weatherController.setCity(input.value);
			return true;
		} else {
			if (input.validity.valueMissing) {
				setError("You need to input a city");
			} else if (input.validity.tooLong) {
				setError("The city name is too long");
			} else if (input.validity.patternMismatch) {
				setError("You need to enter a valid name");
			} else if (isPrevious) {
				setError("You need to input a different city");
			}
			return false;
		}
	}

	async function update() {
		try {
			await weatherController.update();
		} catch (error) {
			setError("The city was not found");
			error.message = "error while updating the data";
			throw error;
		}
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
