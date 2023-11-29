import { weatherController } from "./weatherController.js";

export const weatherInterface = (function () {
	function changeHour(newHour) {
		weatherController.setHour(newHour);
	}
	function changeDay(dayIndex) {
		weatherController.setDay(dayIndex);
	}

	function getHourWeather(newHour) {
		changeHour(newHour);
		return weatherController.getHourWeather();
	}

	function getDayWeather(dayIndex) {
		changeDay(dayIndex);
		return weatherController.getDayWeather();
	}

	function isToday() {
		return weatherController.getCurrentDayIndex() === 0;
	}

	return { getHourWeather, isToday };
	async function update() {
		await weatherController.update();
	}
})();
