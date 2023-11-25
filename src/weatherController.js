import { getWeather } from "./getWeather.js";

export const weatherController = (function () {
	let currentWeather;
	changeCity("buenos aires");
	async function getWeatherForecast(city) {
		currentWeather = await getWeather(city);
		console.log(currentWeather);
	}

	function getDayWeather(index) {
		if (currentWeather) {
				return currentWeather.forecast[index];
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
