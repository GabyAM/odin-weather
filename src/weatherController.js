import { getWeather } from "./getWeather.js";
import { approximateHour } from "./utilities.js";

export const weatherController = (function () {
	let currentWeather;
	const selectedHour = null;
	changeCity("buenos aires");
	async function getWeatherForecast(city) {
		currentWeather = await getWeather(city);
		console.log(currentWeather);
	}

	function getDayWeather(index) {
		if (currentWeather) {
			if (selectedHour) {
				return currentWeather.forecast[index].selectedHour;
			}
			if (index !== 0) {
				const hour = approximateHour(
					currentWeather.current.lastUpdated
				);
				return currentWeather.forecast[index];
			}
			return currentWeather.current;
		}
	}

	async function getCurrentWeather() {
		return currentWeather ? currentWeather.current : null;
	}

	async function changeCity(cityName) {
		await getWeatherForecast(cityName);
	}

	return { changeCity, getDayWeather, getCurrentWeather };
})();
