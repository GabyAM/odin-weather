import { getWeather } from "./getWeather.js";
import { getHourIndex } from "./utilities.js";

export const weatherController = (function () {
	const current = {
		weather: null,
		day: null,
		hour: null,
	};

	async function init() {
		await changeCity("buenos aires");
	}
	// only call when changing city
	async function getWeatherForecast(city) {
		current.weather = await getWeather(city);
		console.log(current.weather);
	}

	// when changing day or hour
	function getDayWeather(dayIndex) {
		if (current.weather) {
			if (current.hour) {
				return current.weather.forecast[dayIndex][current.hour];
			}
			if (dayIndex !== 0) {
				const hourIndex = getHourIndex(current.weather.now.lastUpdated);
				return current.weather.forecast[dayIndex].hours[hourIndex];
			}
			return current.weather.now;
		}
	}

	function getDayCondition(dayIndex) {
		if (current.weather) {
			return current.weather.forecast[dayIndex].condition;
		}
		return null;
	}

	async function getCurrentWeather() {
		return current.weather ? current.weather.now : null;
	}

	async function changeCity(cityName) {
		await getWeatherForecast(cityName);
	}

	/* async function changeHour(newHour) {
		await getDayWeather(newHour);
	} */

	return {
		init,
		changeCity,
		getDayWeather,
		getCurrentWeather,
		getDayCondition,
	};
})();
