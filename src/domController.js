import { weatherController } from "./weatherController.js";

export const domController = (function () {
	const $dayButtons = document.querySelectorAll(".day-button");
	$dayButtons.forEach((button, index) => {
		button.addEventListener("click", () => {
			const dayWeather = weatherController.getDayWeather(index);
			const text = document.createElement("div");
			text.textContent = JSON.stringify(dayWeather);
			document.querySelector("body").appendChild(text);
		});
	});
})();
