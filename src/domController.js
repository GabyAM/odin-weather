import { weatherController } from "./weatherController.js";

export const domController = (function () {
	function loadButtons() {
		const $dayButtons = document.querySelectorAll(".day-button");
		$dayButtons.forEach(async (button, index) => {
			button.addEventListener("click", () => {
				const dayWeather = weatherController.getDayWeather(index);
				const text = document.createElement("div");
				text.textContent = JSON.stringify(dayWeather);
				document.querySelector("body").appendChild(text);
			});

			const condition = await weatherController.getDayCondition(index);
		});
	}

	return { loadButtons };
})();
