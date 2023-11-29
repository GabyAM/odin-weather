import { getWeather } from "./getWeather.js";
import { approximateHour, getTitleFromDate } from "./utilities.js";

export const weatherController = (function () {
	const current = {
		weather: null,
		city: "buenos aires",
		day: 0,
		hour: null,
	};

	async function update() {
		await getWeatherForecast();
	}
	// only call when changing city
	async function getWeatherForecast() {
		current.weather = await getWeather(current.city);
		current.city = getLocation().name;
		console.log(current.weather);
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

	function getDayWeather() {
		return current.weather.forecast[current.day];
	}

	function getCurrentDayIndex() {
		return current.day;
	}

	function getHourWeather() {
		return getDayWeather().hours.find((hour) => hour.time === current.hour);
	}

	function getCurrentWeather() {
		return current.weather.now;
	}

	function getMomentWeather(dayIndex = current.day) {
		setDay(dayIndex);
		if (current.hour) {
			return getHourWeather();
		}
		if (dayIndex !== 0) {
			const newHour = approximateHour(getCurrentWeather().lastUpdated);
			setHour(newHour);
			return getHourWeather();
		}
		return getCurrentWeather();
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
		getCurrentDayIndex,
		getLocation,
	};
})();
