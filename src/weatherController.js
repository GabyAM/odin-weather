import { getWeather } from "./getWeather.js";
import { approximateHour, getTitleFromDate } from "./utilities.js";

export const weatherController = (function () {
	let current = {
		weather: null,
		city: "buenos aires",
		day: 0,
		hour: "Now",
	};

	async function update() {
		const previousCurrent = { ...current };
		try {
			await getWeatherForecast();
		} catch (error) {
			current = previousCurrent;
			error.message = `error while getting the data`;
			throw error;
		}
	}
	// only call when changing city
	async function getWeatherForecast() {
		// current.weather = await getWeather(current.city);
		// current.city = getLocation().name;
		try {
			const weather = await getWeather(current.city);
			current.weather = weather;
		} catch (error) {
			error.message = `Error while saving the data: ${error.message}`;
			throw error;
		}
	}

	function setCity(newCity) {
		current.city = newCity;
	}

	function setDay(newDay) {
		current.day = newDay;
	}

	function setHour(newHour) {
		current.hour = newHour;
	}

	function getDayWeather(day = current.day) {
		return current.weather.forecast[day];
	}

	function getHourWeather() {
		return getDayWeather().hours.find((hour) => hour.time === current.hour);
	}

	function getCurrentWeather() {
		return current.weather.now;
	}

	function getMomentWeather() {
		if (current.hour === "Now") {
			if (current.day === 0) {
				return getCurrentWeather();
			}
			const newHour = approximateHour(getCurrentWeather().lastUpdated);
			setHour(newHour);
		}
		return getHourWeather();
	}

	function getDayCondition(index) {
		return current.weather.forecast[index].condition;
	}

	function getDayTitle(index) {
		return getTitleFromDate(current.weather.forecast[index].date);
	}

	function getLocation() {
		return current.weather.location;
	}

	function getCurrentHour() {
		return current.hour;
	}

	return {
		update,
		setCity,
		setDay,
		setHour,
		getDayWeather,
		getHourWeather,
		getCurrentWeather,
		getMomentWeather,
		getDayCondition,
		getDayTitle,
		getLocation,
		getCurrentHour,
	};
})();
